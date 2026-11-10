import React, { useState, useEffect } from 'react';
import {
  Radio,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  ShieldCheck,
  RefreshCw,
  Compass,
} from 'lucide-react';
import { AIMarketPulse } from '../types/market';
import { useTrading } from '../context/TradingContext';
import { fetchMarketPulse } from '../services/aiService';

export const MarketPulseView: React.FC = () => {
  const { stocks, setSelectedStock, setActiveTab, requestStockAnalysis } = useTrading();
  const [pulse, setPulse] = useState<AIMarketPulse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);

  const loadPulse = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMarketPulse(topGainers, topLosers);
      setPulse(data);
    } catch (err) {
      console.error('Market pulse error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPulse();
  }, []);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-emerald-950/40 border border-zinc-800 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                Real-Time AI Market Pulse & Trend Intelligence
              </h2>
              <p className="text-xs text-zinc-400">
                Macro order flow, volatility regime, and institutional liquidity tracking.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadPulse}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Intel</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
          <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-zinc-200">
            Synthesizing Live Market Order Flow & Trends...
          </p>
        </div>
      ) : pulse ? (
        <div className="space-y-6">
          {/* Sentiment & Headline Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Market Mood Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-zinc-400">
                Macro Market Regime
              </span>
              <div className="my-3">
                <div className="text-2xl font-black font-mono text-emerald-400 flex items-center gap-2">
                  <Compass className="w-6 h-6 text-emerald-400" />
                  {pulse.marketMood.replace('_', ' ')}
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                    <span>Pulse Score</span>
                    <span className="text-emerald-400 font-bold">{pulse.marketPulseScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${pulse.marketPulseScore}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-zinc-400">
                Bias: Intraday dip-buying favoring high-beta semiconductors & AI software.
              </div>
            </div>

            {/* Headline & Narrative Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-xl lg:col-span-2 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Breaking Market Lead
                </span>
                <h3 className="text-base font-extrabold text-white leading-snug">
                  {pulse.headline}
                </h3>
                <div className="text-xs text-zinc-300 mt-2.5 leading-relaxed whitespace-pre-line">
                  {pulse.briefing}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-300">
                  <strong className="text-emerald-400">Today's Edge:</strong> {pulse.actionableTipForToday}
                </span>
              </div>
            </div>
          </div>

          {/* Key Drivers */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Primary Market Catalysts & Drivers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pulse.keyDrivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-xs">{driver.topic}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          driver.impact === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {driver.impact} IMPACT
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{driver.summary}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-zinc-800/60 text-[10px] font-mono">
                    Sentiment:{' '}
                    <span
                      className={`font-bold ${
                        driver.sentiment === 'POSITIVE'
                          ? 'text-emerald-400'
                          : driver.sentiment === 'NEGATIVE'
                          ? 'text-rose-400'
                          : 'text-zinc-400'
                      }`}
                    >
                      {driver.sentiment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Gainers & Losers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Gainers */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-xl">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Intraday Leaders (Top Gainers)
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {topGainers.map((stk) => (
                  <div
                    key={stk.symbol}
                    onClick={() => {
                      setSelectedStock(stk);
                      setActiveTab('terminal');
                    }}
                    className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white">{stk.symbol}</span>
                      <span className="text-[10px] text-zinc-400 ml-2">{stk.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white mr-3">${stk.price.toFixed(2)}</span>
                      <span className="font-bold text-emerald-400">+{stk.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Losers */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-xl">
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                Intraday Laggards (Top Pullbacks)
              </h3>
              <div className="space-y-2 font-mono text-xs">
                {topLosers.map((stk) => (
                  <div
                    key={stk.symbol}
                    onClick={() => {
                      setSelectedStock(stk);
                      setActiveTab('terminal');
                    }}
                    className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-lg p-2.5 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <span className="font-bold text-white">{stk.symbol}</span>
                      <span className="text-[10px] text-zinc-400 ml-2">{stk.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white mr-3">${stk.price.toFixed(2)}</span>
                      <span className="font-bold text-rose-400">{stk.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
