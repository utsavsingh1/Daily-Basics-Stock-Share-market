import { Candle, OrderBook, StockQuote, TechnicalIndicators, TimeAndSale, Timeframe } from '../types/market';

export const INITIAL_STOCKS: StockQuote[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Semiconductors',
    price: 142.85,
    previousClose: 139.40,
    change: 3.45,
    changePercent: 2.47,
    high: 144.20,
    low: 138.90,
    volume: 64280100,
    avgVolume: 58000000,
    marketCap: '$3.51T',
    peRatio: 64.2,
    beta: 1.68,
    fiftyTwoWeekHigh: 149.77,
    fiftyTwoWeekLow: 45.60,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.08,
    minuteChangePercent: 0.42,
    dayChangePercent: 2.47,
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Consumer & Auto',
    price: 228.45,
    previousClose: 226.15,
    change: 2.30,
    changePercent: 1.02,
    high: 229.80,
    low: 225.50,
    volume: 48920400,
    avgVolume: 52000000,
    marketCap: '$3.46T',
    peRatio: 33.8,
    beta: 1.05,
    fiftyTwoWeekHigh: 237.23,
    fiftyTwoWeekLow: 164.08,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.03,
    minuteChangePercent: 0.15,
    dayChangePercent: 1.02,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Consumer & Auto',
    price: 258.90,
    previousClose: 247.30,
    change: 11.60,
    changePercent: 4.69,
    high: 262.40,
    low: 246.10,
    volume: 98120000,
    avgVolume: 85000000,
    marketCap: '$828B',
    peRatio: 78.4,
    beta: 2.32,
    fiftyTwoWeekHigh: 271.00,
    fiftyTwoWeekLow: 138.80,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.14,
    minuteChangePercent: 0.78,
    dayChangePercent: 4.69,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Enterprise & Cloud',
    price: 422.10,
    previousClose: 419.50,
    change: 2.60,
    changePercent: 0.62,
    high: 424.80,
    low: 418.90,
    volume: 21540300,
    avgVolume: 24000000,
    marketCap: '$3.14T',
    peRatio: 35.1,
    beta: 1.12,
    fiftyTwoWeekHigh: 468.35,
    fiftyTwoWeekLow: 366.50,
    lastTickTime: Date.now(),
    tickDirection: 'flat',
    secondChangePercent: -0.01,
    minuteChangePercent: 0.08,
    dayChangePercent: 0.62,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    sector: 'Enterprise & Cloud',
    price: 194.20,
    previousClose: 191.80,
    change: 2.40,
    changePercent: 1.25,
    high: 195.50,
    low: 191.20,
    volume: 38400100,
    avgVolume: 42000000,
    marketCap: '$2.02T',
    peRatio: 42.6,
    beta: 1.24,
    fiftyTwoWeekHigh: 201.20,
    fiftyTwoWeekLow: 139.46,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.05,
    minuteChangePercent: 0.22,
    dayChangePercent: 1.25,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Tech & AI',
    price: 176.50,
    previousClose: 177.80,
    change: -1.30,
    changePercent: -0.73,
    high: 178.60,
    low: 175.40,
    volume: 24500900,
    avgVolume: 26000000,
    marketCap: '$2.19T',
    peRatio: 23.5,
    beta: 1.08,
    fiftyTwoWeekHigh: 193.31,
    fiftyTwoWeekLow: 129.40,
    lastTickTime: Date.now(),
    tickDirection: 'down',
    secondChangePercent: -0.04,
    minuteChangePercent: -0.18,
    dayChangePercent: -0.73,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    sector: 'Tech & AI',
    price: 584.30,
    previousClose: 576.20,
    change: 8.10,
    changePercent: 1.41,
    high: 588.90,
    low: 574.50,
    volume: 14200300,
    avgVolume: 16000000,
    marketCap: '$1.48T',
    peRatio: 27.8,
    beta: 1.34,
    fiftyTwoWeekHigh: 602.95,
    fiftyTwoWeekLow: 313.66,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.06,
    minuteChangePercent: 0.31,
    dayChangePercent: 1.41,
  },
  {
    symbol: 'AMD',
    name: 'Advanced Micro Devices',
    sector: 'Semiconductors',
    price: 148.60,
    previousClose: 144.30,
    change: 4.30,
    changePercent: 2.98,
    high: 151.20,
    low: 143.80,
    volume: 51200400,
    avgVolume: 49000000,
    marketCap: '$240B',
    peRatio: 82.5,
    beta: 1.84,
    fiftyTwoWeekHigh: 227.30,
    fiftyTwoWeekLow: 114.50,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.11,
    minuteChangePercent: 0.55,
    dayChangePercent: 2.98,
  },
  {
    symbol: 'PLTR',
    name: 'Palantir Technologies',
    sector: 'Tech & AI',
    price: 44.80,
    previousClose: 42.10,
    change: 2.70,
    changePercent: 6.41,
    high: 45.60,
    low: 41.80,
    volume: 82300000,
    avgVolume: 62000000,
    marketCap: '$101B',
    peRatio: 118.0,
    beta: 2.45,
    fiftyTwoWeekHigh: 46.20,
    fiftyTwoWeekLow: 15.66,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.18,
    minuteChangePercent: 0.92,
    dayChangePercent: 6.41,
  },
  {
    symbol: 'COIN',
    name: 'Coinbase Global, Inc.',
    sector: 'Crypto & FinTech',
    price: 224.50,
    previousClose: 215.00,
    change: 9.50,
    changePercent: 4.42,
    high: 228.00,
    low: 214.20,
    volume: 18400000,
    avgVolume: 15000000,
    marketCap: '$55.6B',
    peRatio: 46.2,
    beta: 3.10,
    fiftyTwoWeekHigh: 283.48,
    fiftyTwoWeekLow: 84.10,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.15,
    minuteChangePercent: 0.65,
    dayChangePercent: 4.42,
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    sector: 'ETFs & Indexes',
    price: 582.40,
    previousClose: 579.80,
    change: 2.60,
    changePercent: 0.45,
    high: 584.10,
    low: 579.20,
    volume: 45200300,
    avgVolume: 55000000,
    marketCap: '$592B',
    peRatio: 26.4,
    beta: 1.00,
    fiftyTwoWeekHigh: 588.25,
    fiftyTwoWeekLow: 432.50,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.02,
    minuteChangePercent: 0.09,
    dayChangePercent: 0.45,
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust (Nasdaq 100)',
    sector: 'ETFs & Indexes',
    price: 498.75,
    previousClose: 494.30,
    change: 4.45,
    changePercent: 0.90,
    high: 501.20,
    low: 493.80,
    volume: 38200100,
    avgVolume: 44000000,
    marketCap: '$285B',
    peRatio: 29.8,
    beta: 1.15,
    fiftyTwoWeekHigh: 503.52,
    fiftyTwoWeekLow: 365.10,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.04,
    minuteChangePercent: 0.18,
    dayChangePercent: 0.90,
  },
  {
    symbol: 'ARM',
    name: 'Arm Holdings plc',
    sector: 'Semiconductors',
    price: 141.20,
    previousClose: 137.50,
    change: 3.70,
    changePercent: 2.69,
    high: 143.50,
    low: 136.80,
    volume: 16200100,
    avgVolume: 18000000,
    marketCap: '$147B',
    peRatio: 94.0,
    beta: 2.20,
    fiftyTwoWeekHigh: 188.75,
    fiftyTwoWeekLow: 52.80,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.09,
    minuteChangePercent: 0.44,
    dayChangePercent: 2.69,
  },
  {
    symbol: 'SMCI',
    name: 'Super Micro Computer, Inc.',
    sector: 'Enterprise & Cloud',
    price: 38.50,
    previousClose: 36.80,
    change: 1.70,
    changePercent: 4.62,
    high: 40.20,
    low: 35.90,
    volume: 58400000,
    avgVolume: 42000000,
    marketCap: '$22.5B',
    peRatio: 14.8,
    beta: 3.40,
    fiftyTwoWeekHigh: 122.90,
    fiftyTwoWeekLow: 26.00,
    lastTickTime: Date.now(),
    tickDirection: 'up',
    secondChangePercent: 0.22,
    minuteChangePercent: 0.85,
    dayChangePercent: 4.62,
  },
];

// Seeded pseudorandom generator for deterministic reproducible initial charts
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate historical candle series for any timeframe
 */
export function generateCandles(symbol: string, currentPrice: number, timeframe: Timeframe): Candle[] {
  let count = 80;
  let intervalMs = 60 * 1000; // default 1m
  let volatility = 0.003;

  switch (timeframe) {
    case '1s':
      count = 90; // last 90 seconds
      intervalMs = 1000;
      volatility = 0.0006;
      break;
    case '1m':
      count = 90; // last 90 minutes
      intervalMs = 60 * 1000;
      volatility = 0.002;
      break;
    case '5m':
      count = 80; // ~6.6 hours
      intervalMs = 5 * 60 * 1000;
      volatility = 0.004;
      break;
    case '1h':
      count = 72; // ~3 days
      intervalMs = 60 * 60 * 1000;
      volatility = 0.008;
      break;
    case '1D':
      count = 60; // 60 trading days
      intervalMs = 24 * 60 * 60 * 1000;
      volatility = 0.016;
      break;
    case '1W':
      count = 52; // 1 year
      intervalMs = 7 * 24 * 60 * 60 * 1000;
      volatility = 0.032;
      break;
    case '1M':
      count = 24; // 2 years
      intervalMs = 30 * 24 * 60 * 60 * 1000;
      volatility = 0.055;
      break;
    case '1Y':
      count = 6;
      intervalMs = 365 * 24 * 60 * 60 * 1000;
      volatility = 0.12;
      break;
  }

  const now = Date.now();
  const candles: Candle[] = [];
  const baseSeed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 100);

  // Walk backwards from current price to establish realistic trajectory
  let walkPrice = currentPrice;
  const tempPrices: { open: number; high: number; low: number; close: number; volume: number }[] = [];

  for (let i = 0; i < count; i++) {
    const rnd1 = seededRandom(baseSeed + i * 7) - 0.485; // slight upward drift
    const delta = walkPrice * rnd1 * volatility;
    const close = walkPrice;
    const open = close - delta;
    const highWick = Math.abs(delta) * (0.3 + seededRandom(baseSeed + i * 13) * 0.7);
    const lowWick = Math.abs(delta) * (0.3 + seededRandom(baseSeed + i * 17) * 0.7);
    const high = Math.max(open, close) + highWick;
    const low = Math.min(open, close) - lowWick;
    const volume = Math.floor((10000 + seededRandom(baseSeed + i * 3) * 50000) * (timeframe === '1s' ? 0.05 : timeframe === '1m' ? 0.5 : 2.5));

    tempPrices.unshift({
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });

    walkPrice = open;
  }

  // Adjust so the very last candle matches currentPrice
  const lastDelta = currentPrice - tempPrices[tempPrices.length - 1].close;
  for (let i = 0; i < tempPrices.length; i++) {
    const factor = (i + 1) / tempPrices.length;
    const p = tempPrices[i];
    p.open = +(p.open + lastDelta * factor).toFixed(2);
    p.high = +(p.high + lastDelta * factor).toFixed(2);
    p.low = +(p.low + lastDelta * factor).toFixed(2);
    p.close = +(p.close + lastDelta * factor).toFixed(2);
  }

  // Calculate cumulative VWAP
  let cumVol = 0;
  let cumTypVol = 0;

  for (let i = 0; i < tempPrices.length; i++) {
    const time = now - (count - 1 - i) * intervalMs;
    const p = tempPrices[i];
    const typicalPrice = (p.high + p.low + p.close) / 3;
    cumVol += p.volume;
    cumTypVol += typicalPrice * p.volume;
    const vwap = +(cumTypVol / (cumVol || 1)).toFixed(2);

    candles.push({
      time,
      open: p.open,
      high: p.high,
      low: p.low,
      close: p.close,
      volume: p.volume,
      vwap,
    });
  }

  return candles;
}

/**
 * Computes Technical Indicators from candle series
 */
export function calculateTechnicals(candles: Candle[]): TechnicalIndicators {
  if (candles.length < 2) {
    return {
      sma20: null,
      sma50: null,
      ema12: null,
      rsi: null,
      macd: null,
      bollinger: null,
      vwap: null,
    };
  }

  const closes = candles.map((c) => c.close);
  const n = closes.length;

  // SMA 20
  let sma20: number | null = null;
  if (n >= 20) {
    const slice20 = closes.slice(n - 20);
    sma20 = +(slice20.reduce((a, b) => a + b, 0) / 20).toFixed(2);
  }

  // SMA 50
  let sma50: number | null = null;
  if (n >= 50) {
    const slice50 = closes.slice(n - 50);
    sma50 = +(slice50.reduce((a, b) => a + b, 0) / 50).toFixed(2);
  }

  // EMA 12
  let ema12: number | null = null;
  const k12 = 2 / (12 + 1);
  let currentEma = closes[0];
  for (let i = 1; i < n; i++) {
    currentEma = closes[i] * k12 + currentEma * (1 - k12);
  }
  ema12 = +currentEma.toFixed(2);

  // Bollinger Bands (20 periods, 2 std dev)
  let bollinger: { upper: number; middle: number; lower: number } | null = null;
  if (sma20 !== null && n >= 20) {
    const slice20 = closes.slice(n - 20);
    const variance = slice20.reduce((acc, val) => acc + Math.pow(val - sma20!, 2), 0) / 20;
    const stdDev = Math.sqrt(variance);
    bollinger = {
      upper: +(sma20 + 2 * stdDev).toFixed(2),
      middle: sma20,
      lower: +(sma20 - 2 * stdDev).toFixed(2),
    };
  }

  // RSI (14 period)
  let rsi: number | null = null;
  if (n >= 15) {
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= 14; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    let avgGain = gains / 14;
    let avgLoss = losses / 14;

    for (let i = 15; i < n; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) {
        avgGain = (avgGain * 13 + diff) / 14;
        avgLoss = (avgLoss * 13) / 14;
      } else {
        avgGain = (avgGain * 13) / 14;
        avgLoss = (avgLoss * 13 + Math.abs(diff)) / 14;
      }
    }

    if (avgLoss === 0) {
      rsi = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi = +(100 - 100 / (1 + rs)).toFixed(1);
    }
  }

  // MACD (12, 26, 9)
  let macd: { value: number; signal: number; histogram: number } | null = null;
  if (n >= 26) {
    const kShort = 2 / (12 + 1);
    const kLong = 2 / (26 + 1);
    let emaShort = closes[0];
    let emaLong = closes[0];
    const macdLineSeries: number[] = [];

    for (let i = 1; i < n; i++) {
      emaShort = closes[i] * kShort + emaShort * (1 - kShort);
      emaLong = closes[i] * kLong + emaLong * (1 - kLong);
      if (i >= 25) {
        macdLineSeries.push(emaShort - emaLong);
      }
    }

    const currentMacd = emaShort - emaLong;
    let signal = macdLineSeries[0] || 0;
    const kSignal = 2 / (9 + 1);
    for (let i = 1; i < macdLineSeries.length; i++) {
      signal = macdLineSeries[i] * kSignal + signal * (1 - kSignal);
    }

    const hist = currentMacd - signal;
    macd = {
      value: +currentMacd.toFixed(2),
      signal: +signal.toFixed(2),
      histogram: +hist.toFixed(2),
    };
  }

  const lastCandle = candles[candles.length - 1];

  return {
    sma20,
    sma50,
    ema12,
    rsi: rsi ?? 52.4,
    macd: macd ?? { value: 0.85, signal: 0.62, histogram: 0.23 },
    bollinger,
    vwap: lastCandle?.vwap ?? lastCandle?.close ?? null,
  };
}

/**
 * Generate simulated Level-2 Order Book with realistic bids and asks
 */
export function generateOrderBook(currentPrice: number): OrderBook {
  const spread = +(0.01 + Math.random() * 0.03).toFixed(2);
  const bestBid = +(currentPrice - spread / 2).toFixed(2);
  const bestAsk = +(currentPrice + spread / 2).toFixed(2);

  const bids: OrderBook['bids'] = [];
  const asks: OrderBook['asks'] = [];

  let cumBidSize = 0;
  for (let i = 0; i < 8; i++) {
    const price = +(bestBid - i * 0.02).toFixed(2);
    const size = Math.floor(100 + Math.random() * 850);
    cumBidSize += size;
    bids.push({ price, size, total: cumBidSize });
  }

  let cumAskSize = 0;
  for (let i = 0; i < 8; i++) {
    const price = +(bestAsk + i * 0.02).toFixed(2);
    const size = Math.floor(100 + Math.random() * 850);
    cumAskSize += size;
    asks.push({ price, size, total: cumAskSize });
  }

  return {
    bids,
    asks,
    spread,
    spreadPercent: +((spread / currentPrice) * 100).toFixed(3),
  };
}

/**
 * Generate a stream of real-time Time & Sales executions
 */
export function generateRecentTrades(currentPrice: number, count = 10): TimeAndSale[] {
  const trades: TimeAndSale[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const isBuy = Math.random() > 0.47;
    const offset = (Math.random() - 0.5) * 0.04;
    const price = +(currentPrice + offset).toFixed(2);
    const size = [50, 100, 200, 350, 500, 1200][Math.floor(Math.random() * 6)];
    const tradeTime = new Date(now - i * 850).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    trades.push({
      id: `trade-${now}-${i}`,
      time: tradeTime,
      price,
      size,
      side: isBuy ? 'buy' : 'sell',
    });
  }

  return trades;
}
