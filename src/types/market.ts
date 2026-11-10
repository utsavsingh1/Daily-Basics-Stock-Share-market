export type Timeframe = '1s' | '1m' | '5m' | '1h' | '1D' | '1W' | '1M' | '1Y';

export interface Candle {
  time: number; // timestamp ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap?: number;
}

export interface StockQuote {
  symbol: string;
  name: string;
  sector: 'Tech & AI' | 'Consumer & Auto' | 'Semiconductors' | 'Enterprise & Cloud' | 'ETFs & Indexes' | 'Crypto & FinTech';
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  avgVolume: number;
  marketCap: string;
  peRatio: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  lastTickTime: number;
  tickDirection: 'up' | 'down' | 'flat';
  secondChangePercent: number; // real-time 1s delta
  minuteChangePercent: number; // real-time 1m delta
  dayChangePercent: number;    // day delta
}

export interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  spread: number;
  spreadPercent: number;
}

export interface TimeAndSale {
  id: string;
  time: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
}

export interface Position {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  dayPL: number;
  dayPLPercent: number;
}

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED';

export interface Order {
  id: string;
  timestamp: number;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  shares: number;
  price: number;
  limitPrice?: number;
  stopPrice?: number;
  status: OrderStatus;
  totalValue: number;
}

export interface TechnicalIndicators {
  sma20: number | null;
  sma50: number | null;
  ema12: number | null;
  rsi: number | null;
  macd: {
    value: number;
    signal: number;
    histogram: number;
  } | null;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  } | null;
  vwap: number | null;
}

export interface AIAnalysisResult {
  rating: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';
  confidenceScore: number;
  targetPriceShortTerm: number;
  targetPriceLongTerm: number;
  stopLossSuggestion: number;
  verdictTitle: string;
  summary: string;
  technicalBreakdown: {
    momentum: string;
    supportLevel: number;
    resistanceLevel: number;
    indicatorSignal: string;
  };
  catalysts: string[];
  risks: string[];
  dayTradingPlay: string;
  swingTradingPlay: string;
}

export interface AIPortfolioReview {
  portfolioHealthScore: number;
  riskRating: 'Conservative' | 'Moderate' | 'Aggressive' | 'Ultra-High Risk';
  summary: string;
  sectorAllocationReview: string;
  topStrengths: string[];
  criticalVulnerabilities: string[];
  actionableRecommendations: {
    symbol: string;
    recommendedAction: 'BUY MORE' | 'TRIM PROFIT' | 'HOLD' | 'CUT LOSS' | 'SET STOP';
    targetWeight: string;
    rationale: string;
  }[];
  macroHedgingTip: string;
}

export interface AIMarketPulse {
  marketMood: 'BULLISH' | 'NEUTRAL' | 'BEARISH' | 'EXTREME_GREED' | 'FEAR';
  headline: string;
  marketPulseScore: number;
  briefing: string;
  keyDrivers: {
    topic: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    summary: string;
  }[];
  actionableTipForToday: string;
}

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  direction: 'above' | 'below';
  createdAt: number;
  triggered: boolean;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  content: string;
  timestamp: number;
  actionableSetup?: {
    symbol: string;
    action: 'BUY' | 'SELL';
    targetPrice: number;
  };
}
