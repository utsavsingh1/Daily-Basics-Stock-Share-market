import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  AIAnalysisResult,
  Candle,
  Order,
  OrderBook,
  Position,
  PriceAlert,
  StockQuote,
  TechnicalIndicators,
  TimeAndSale,
  Timeframe,
} from '../types/market';
import {
  INITIAL_STOCKS,
  calculateTechnicals,
  generateCandles,
  generateOrderBook,
  generateRecentTrades,
} from '../services/marketData';
import { fetchStockAnalysis } from '../services/aiService';

interface TradingContextType {
  stocks: StockQuote[];
  selectedStock: StockQuote;
  setSelectedStock: (stock: StockQuote) => void;
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  candles: Candle[];
  technicals: TechnicalIndicators;
  orderBook: OrderBook;
  recentTrades: TimeAndSale[];
  positions: Position[];
  cashBalance: number;
  totalPortfolioValue: number;
  totalProfitLoss: number;
  totalProfitLossPercent: number;
  dayProfitLoss: number;
  dayProfitLossPercent: number;
  orders: Order[];
  alerts: PriceAlert[];
  addAlert: (symbol: string, targetPrice: number, direction: 'above' | 'below', notes?: string) => void;
  removeAlert: (id: string) => void;
  activeAlertTriggered: PriceAlert | null;
  dismissActiveAlert: () => void;
  executeOrder: (orderData: { symbol: string; side: 'BUY' | 'SELL'; type: 'MARKET' | 'LIMIT' | 'STOP_LOSS'; shares: number; limitPrice?: number; stopPrice?: number }) => { success: boolean; message: string };
  closePosition: (symbol: string) => void;
  resetAccount: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  isAnalyzingStock: boolean;
  stockAnalysisModalOpen: boolean;
  setStockAnalysisModalOpen: (val: boolean) => void;
  aiAnalysis: AIAnalysisResult | null;
  requestStockAnalysis: (stock?: StockQuote) => Promise<void>;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (val: boolean) => void;
  activeTab: 'terminal' | 'screener' | 'portfolio' | 'timeHorizon' | 'marketPulse';
  setActiveTab: (tab: 'terminal' | 'screener' | 'portfolio' | 'timeHorizon' | 'marketPulse') => void;
  lastTickDirection: 'up' | 'down' | 'flat';
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

// Initial starter portfolio positions
const INITIAL_POSITIONS: Position[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 100,
    avgPrice: 132.50,
    currentPrice: 142.85,
    marketValue: 14285.00,
    unrealizedPL: 1035.00,
    unrealizedPLPercent: 7.81,
    dayPL: 345.00,
    dayPLPercent: 2.47,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 80,
    avgPrice: 221.00,
    currentPrice: 228.45,
    marketValue: 18276.00,
    unrealizedPL: 596.00,
    unrealizedPLPercent: 3.37,
    dayPL: 184.00,
    dayPLPercent: 1.02,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    shares: 60,
    avgPrice: 242.00,
    currentPrice: 258.90,
    marketValue: 15534.00,
    unrealizedPL: 1014.00,
    unrealizedPLPercent: 6.98,
    dayPL: 696.00,
    dayPLPercent: 4.69,
  },
];

const INITIAL_CASH = 51905.00; // Total starting portfolio ~$100,000

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<StockQuote[]>(() => {
    const saved = localStorage.getItem('apextrade_stocks');
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });

  const [selectedStock, setSelectedStockState] = useState<StockQuote>(() => stocks[0] || INITIAL_STOCKS[0]);
  const [timeframe, setTimeframe] = useState<Timeframe>('1s');
  const [candles, setCandles] = useState<Candle[]>(() => generateCandles(INITIAL_STOCKS[0].symbol, INITIAL_STOCKS[0].price, '1s'));
  const [technicals, setTechnicals] = useState<TechnicalIndicators>(() => calculateTechnicals(candles));
  const [orderBook, setOrderBook] = useState<OrderBook>(() => generateOrderBook(INITIAL_STOCKS[0].price));
  const [recentTrades, setRecentTrades] = useState<TimeAndSale[]>(() => generateRecentTrades(INITIAL_STOCKS[0].price, 12));

  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem('apextrade_positions');
    return saved ? JSON.parse(saved) : INITIAL_POSITIONS;
  });

  const [cashBalance, setCashBalance] = useState<number>(() => {
    const saved = localStorage.getItem('apextrade_cash');
    return saved ? parseFloat(saved) : INITIAL_CASH;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('apextrade_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'ord-init-1',
        timestamp: Date.now() - 3600000 * 2,
        symbol: 'NVDA',
        side: 'BUY',
        type: 'MARKET',
        shares: 100,
        price: 132.50,
        status: 'FILLED',
        totalValue: 13250.00,
      },
      {
        id: 'ord-init-2',
        timestamp: Date.now() - 3600000 * 4,
        symbol: 'AAPL',
        side: 'BUY',
        type: 'MARKET',
        shares: 80,
        price: 221.00,
        status: 'FILLED',
        totalValue: 17680.00,
      },
    ];
  });

  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('apextrade_alerts');
    return saved ? JSON.parse(saved) : [
      {
        id: 'alert-1',
        symbol: 'NVDA',
        targetPrice: 145.00,
        direction: 'above',
        createdAt: Date.now() - 10000,
        triggered: false,
        notes: 'Take profit level 1',
      },
      {
        id: 'alert-2',
        symbol: 'TSLA',
        targetPrice: 250.00,
        direction: 'below',
        createdAt: Date.now() - 5000,
        triggered: false,
        notes: 'Stop loss support test',
      },
    ];
  });

  const [activeAlertTriggered, setActiveAlertTriggered] = useState<PriceAlert | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAnalyzingStock, setIsAnalyzingStock] = useState<boolean>(false);
  const [stockAnalysisModalOpen, setStockAnalysisModalOpen] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'screener' | 'portfolio' | 'timeHorizon' | 'marketPulse'>('terminal');
  const [lastTickDirection, setLastTickDirection] = useState<'up' | 'down' | 'flat'>('flat');

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Play subtle trade click/chime sound
  const playSound = useCallback((type: 'tick' | 'order' | 'alert') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'order') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'alert') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch {
      // Audio autoplay policy handled silently
    }
  }, [soundEnabled]);

  // Sync positions & cash to localStorage
  useEffect(() => {
    localStorage.setItem('apextrade_positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('apextrade_cash', cashBalance.toString());
  }, [cashBalance]);

  useEffect(() => {
    localStorage.setItem('apextrade_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('apextrade_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // When selectedStock or timeframe changes, regenerate base candles
  useEffect(() => {
    const newCandles = generateCandles(selectedStock.symbol, selectedStock.price, timeframe);
    setCandles(newCandles);
    setTechnicals(calculateTechnicals(newCandles));
    setOrderBook(generateOrderBook(selectedStock.price));
  }, [selectedStock.symbol, timeframe]);

  // High-frequency live tick loop: Updates every 800ms
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) => {
        const updated = prevStocks.map((stock) => {
          // Brownian motion with beta multiplier
          const volatility = 0.0008 * (stock.beta || 1.2);
          const rand = Math.random() - 0.49;
          const delta = +(stock.price * rand * volatility).toFixed(2);
          if (delta === 0) return stock;

          const newPrice = +(stock.price + delta).toFixed(2);
          const newHigh = Math.max(stock.high, newPrice);
          const newLow = Math.min(stock.low, newPrice);
          const newChange = +(newPrice - stock.previousClose).toFixed(2);
          const newChangePercent = +((newChange / stock.previousClose) * 100).toFixed(2);
          const secondDelta = +((delta / stock.price) * 100).toFixed(2);
          const tickDir: 'up' | 'down' | 'flat' = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high: newHigh,
            low: newLow,
            volume: stock.volume + Math.floor(10 + Math.random() * 80),
            lastTickTime: Date.now(),
            tickDirection: tickDir,
            secondChangePercent: secondDelta,
            minuteChangePercent: +(stock.minuteChangePercent + secondDelta * 0.2).toFixed(2),
            dayChangePercent: newChangePercent,
          };
        });

        // Update selected stock reference
        const currentSelected = updated.find((s) => s.symbol === selectedStock.symbol);
        if (currentSelected && currentSelected.price !== selectedStock.price) {
          setSelectedStockState(currentSelected);
          setLastTickDirection(currentSelected.tickDirection);

          // Update active live candle in real time!
          setCandles((prevCandles) => {
            if (prevCandles.length === 0) return prevCandles;
            const last = prevCandles[prevCandles.length - 1];
            const now = Date.now();
            const intervalMs = timeframe === '1s' ? 1000 : timeframe === '1m' ? 60000 : 300000;

            if (now - last.time < intervalMs) {
              // Update last candle in-place
              const updatedLast: Candle = {
                ...last,
                high: Math.max(last.high, currentSelected.price),
                low: Math.min(last.low, currentSelected.price),
                close: currentSelected.price,
                volume: last.volume + Math.floor(5 + Math.random() * 25),
              };
              const newArr = [...prevCandles.slice(0, -1), updatedLast];
              setTechnicals(calculateTechnicals(newArr));
              return newArr;
            } else {
              // Create new candle
              const newCandle: Candle = {
                time: now,
                open: currentSelected.price,
                high: currentSelected.price,
                low: currentSelected.price,
                close: currentSelected.price,
                volume: Math.floor(20 + Math.random() * 60),
                vwap: currentSelected.price,
              };
              const newArr = [...prevCandles.slice(1), newCandle];
              setTechnicals(calculateTechnicals(newArr));
              return newArr;
            }
          });

          // Refresh orderbook and recent trades
          setOrderBook(generateOrderBook(currentSelected.price));
          setRecentTrades((prev) => {
            const isBuy = currentSelected.tickDirection === 'up';
            const newTrade: TimeAndSale = {
              id: `t-${Date.now()}`,
              time: new Date().toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
              price: currentSelected.price,
              size: [50, 100, 200, 400, 1000][Math.floor(Math.random() * 5)],
              side: isBuy ? 'buy' : 'sell',
            };
            return [newTrade, ...prev.slice(0, 14)];
          });

          // Check Price Alerts
          alerts.forEach((alert) => {
            if (!alert.triggered && alert.symbol === currentSelected.symbol) {
              if (
                (alert.direction === 'above' && currentSelected.price >= alert.targetPrice) ||
                (alert.direction === 'below' && currentSelected.price <= alert.targetPrice)
              ) {
                alert.triggered = true;
                setActiveAlertTriggered(alert);
                playSound('alert');
              }
            }
          });
        }

        // Update positions current price and unrealized P&L
        setPositions((prevPositions) =>
          prevPositions.map((pos) => {
            const quote = updated.find((s) => s.symbol === pos.symbol);
            if (!quote) return pos;

            const mktValue = +(pos.shares * quote.price).toFixed(2);
            const costBasis = +(pos.shares * pos.avgPrice).toFixed(2);
            const unPL = +(mktValue - costBasis).toFixed(2);
            const unPLPct = +((unPL / costBasis) * 100).toFixed(2);
            const dayPLVal = +(pos.shares * quote.change).toFixed(2);
            const dayPLPct = quote.changePercent;

            return {
              ...pos,
              currentPrice: quote.price,
              marketValue: mktValue,
              unrealizedPL: unPL,
              unrealizedPLPercent: unPLPct,
              dayPL: dayPLVal,
              dayPLPercent: dayPLPct,
            };
          })
        );

        return updated;
      });
    }, 850);

    return () => clearInterval(interval);
  }, [selectedStock.symbol, timeframe, alerts, playSound]);

  // Derived portfolio metrics
  const totalHoldingsValue = positions.reduce((acc, p) => acc + p.marketValue, 0);
  const totalPortfolioValue = +(cashBalance + totalHoldingsValue).toFixed(2);
  const totalCostBasis = positions.reduce((acc, p) => acc + p.shares * p.avgPrice, 0);
  const totalProfitLoss = +(totalHoldingsValue - totalCostBasis).toFixed(2);
  const totalProfitLossPercent = totalCostBasis > 0 ? +((totalProfitLoss / totalCostBasis) * 100).toFixed(2) : 0;
  const dayProfitLoss = +positions.reduce((acc, p) => acc + p.dayPL, 0).toFixed(2);
  const dayProfitLossPercent = totalPortfolioValue > 0 ? +((dayProfitLoss / (totalPortfolioValue - dayProfitLoss)) * 100).toFixed(2) : 0;

  // Execute Order
  const executeOrder = useCallback(
    (orderData: {
      symbol: string;
      side: 'BUY' | 'SELL';
      type: 'MARKET' | 'LIMIT' | 'STOP_LOSS';
      shares: number;
      limitPrice?: number;
      stopPrice?: number;
    }) => {
      const stock = stocks.find((s) => s.symbol === orderData.symbol);
      if (!stock) return { success: false, message: 'Stock not found' };

      const executionPrice = orderData.type === 'LIMIT' && orderData.limitPrice ? orderData.limitPrice : stock.price;
      const totalCost = +(orderData.shares * executionPrice).toFixed(2);

      if (orderData.side === 'BUY') {
        if (cashBalance < totalCost) {
          return { success: false, message: `Insufficient cash ($${cashBalance.toFixed(2)}) for order of $${totalCost.toFixed(2)}` };
        }

        // Deduct cash
        setCashBalance((prev) => +(prev - totalCost).toFixed(2));

        // Add or update position
        setPositions((prev) => {
          const existing = prev.find((p) => p.symbol === orderData.symbol);
          if (existing) {
            const newShares = existing.shares + orderData.shares;
            const newAvgPrice = +((existing.shares * existing.avgPrice + totalCost) / newShares).toFixed(2);
            return prev.map((p) =>
              p.symbol === orderData.symbol
                ? {
                    ...p,
                    shares: newShares,
                    avgPrice: newAvgPrice,
                    marketValue: +(newShares * executionPrice).toFixed(2),
                    unrealizedPL: +(newShares * executionPrice - newShares * newAvgPrice).toFixed(2),
                    unrealizedPLPercent: +(((executionPrice - newAvgPrice) / newAvgPrice) * 100).toFixed(2),
                  }
                : p
            );
          } else {
            return [
              ...prev,
              {
                symbol: stock.symbol,
                name: stock.name,
                shares: orderData.shares,
                avgPrice: executionPrice,
                currentPrice: executionPrice,
                marketValue: totalCost,
                unrealizedPL: 0,
                unrealizedPLPercent: 0,
                dayPL: 0,
                dayPLPercent: 0,
              },
            ];
          }
        });

        // Trigger confetti celebration
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10B981', '#34D399', '#059669', '#38BDF8'],
        });
        playSound('order');

        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          timestamp: Date.now(),
          symbol: orderData.symbol,
          side: 'BUY',
          type: orderData.type,
          shares: orderData.shares,
          price: executionPrice,
          limitPrice: orderData.limitPrice,
          stopPrice: orderData.stopPrice,
          status: 'FILLED',
          totalValue: totalCost,
        };
        setOrders((prev) => [newOrder, ...prev]);

        return { success: true, message: `Successfully bought ${orderData.shares} shares of ${orderData.symbol} at $${executionPrice}` };
      } else {
        // SELL
        const existing = positions.find((p) => p.symbol === orderData.symbol);
        if (!existing || existing.shares < orderData.shares) {
          return { success: false, message: `You do not own enough shares of ${orderData.symbol} to sell.` };
        }

        // Add cash
        setCashBalance((prev) => +(prev + totalCost).toFixed(2));

        // Update positions
        setPositions((prev) => {
          if (existing.shares === orderData.shares) {
            return prev.filter((p) => p.symbol !== orderData.symbol);
          } else {
            const remaining = existing.shares - orderData.shares;
            return prev.map((p) =>
              p.symbol === orderData.symbol
                ? {
                    ...p,
                    shares: remaining,
                    marketValue: +(remaining * executionPrice).toFixed(2),
                    unrealizedPL: +(remaining * executionPrice - remaining * p.avgPrice).toFixed(2),
                    unrealizedPLPercent: +(((executionPrice - p.avgPrice) / p.avgPrice) * 100).toFixed(2),
                  }
                : p
            );
          }
        });

        playSound('order');

        const newOrder: Order = {
          id: `ord-${Date.now()}`,
          timestamp: Date.now(),
          symbol: orderData.symbol,
          side: 'SELL',
          type: orderData.type,
          shares: orderData.shares,
          price: executionPrice,
          limitPrice: orderData.limitPrice,
          stopPrice: orderData.stopPrice,
          status: 'FILLED',
          totalValue: totalCost,
        };
        setOrders((prev) => [newOrder, ...prev]);

        return { success: true, message: `Successfully sold ${orderData.shares} shares of ${orderData.symbol} at $${executionPrice}` };
      }
    },
    [stocks, cashBalance, positions, playSound]
  );

  const closePosition = useCallback(
    (symbol: string) => {
      const pos = positions.find((p) => p.symbol === symbol);
      if (!pos) return;
      executeOrder({
        symbol,
        side: 'SELL',
        type: 'MARKET',
        shares: pos.shares,
      });
    },
    [positions, executeOrder]
  );

  const resetAccount = useCallback(() => {
    setPositions(INITIAL_POSITIONS);
    setCashBalance(INITIAL_CASH);
    setOrders([]);
    setAlerts([]);
  }, []);

  const addAlert = useCallback((symbol: string, targetPrice: number, direction: 'above' | 'below', notes?: string) => {
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbol,
      targetPrice,
      direction,
      createdAt: Date.now(),
      triggered: false,
      notes,
    };
    setAlerts((prev) => [newAlert, ...prev]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const dismissActiveAlert = useCallback(() => {
    setActiveAlertTriggered(null);
  }, []);

  const setSelectedStock = useCallback(
    (stock: StockQuote) => {
      setSelectedStockState(stock);
    },
    []
  );

  // Request Gemini Stock Analysis
  const requestStockAnalysis = useCallback(
    async (stock?: StockQuote) => {
      const target = stock || selectedStock;
      setIsAnalyzingStock(true);
      setStockAnalysisModalOpen(true);
      try {
        const result = await fetchStockAnalysis(target, technicals, timeframe);
        setAiAnalysis(result);
      } catch (err) {
        console.error('Failed to analyze stock:', err);
      } finally {
        setIsAnalyzingStock(false);
      }
    },
    [selectedStock, technicals, timeframe]
  );

  return (
    <TradingContext.Provider
      value={{
        stocks,
        selectedStock,
        setSelectedStock,
        timeframe,
        setTimeframe,
        candles,
        technicals,
        orderBook,
        recentTrades,
        positions,
        cashBalance,
        totalPortfolioValue,
        totalProfitLoss,
        totalProfitLossPercent,
        dayProfitLoss,
        dayProfitLossPercent,
        orders,
        alerts,
        addAlert,
        removeAlert,
        activeAlertTriggered,
        dismissActiveAlert,
        executeOrder,
        closePosition,
        resetAccount,
        soundEnabled,
        setSoundEnabled,
        isAnalyzingStock,
        stockAnalysisModalOpen,
        setStockAnalysisModalOpen,
        aiAnalysis,
        requestStockAnalysis,
        isCopilotOpen,
        setIsCopilotOpen,
        activeTab,
        setActiveTab,
        lastTickDirection,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
