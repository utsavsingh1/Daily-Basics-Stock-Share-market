import React, { useState } from 'react';
import {
  Clock,
  Zap,
  Calendar,
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Gauge,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

export const TimeHorizonScanner: React.FC = () => {
  const { selectedStock, stocks, setSelectedStock, setActiveTab, requestStockAnalysis } = useTrading();
  const [activeHorizon, setActiveHorizon] = useState<'seconds' | 'minutes' | 'days'>('seconds');

  // Simulated 30-day calendar performance for selectedStock
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const seed = selectedStock.symbol.charCodeAt(0) + i * 13;
    const delta = (Math.sin(seed) * 3.8).toFixed(2);
    const num = parseFloat(delta);
    return {
      day: i + 1,
      delta: num,
      isGreen: num >= 0,
      volume: (20 + (Math.cos(seed) * 15 + 15)).toFixed(1) + 'M',
    };
  });

  const greenDays = calendarDays.filter((d) => d.isGreen).length;
  const winRate = ((greenDays / 30) * 100).toFixed(0);
  const bestDay = Math.max(...calendarDays.map((d) => d.delta));
  const worstDay = Math.min(...calendarDays.map((d) => d.delta));

  // Minute intervals simulated
  const minuteSessions = [
    { name: 'Opening Bell Rush (09:30 - 10:30)', volPct: 38, momentum: '+1.45%', sentiment: 'Aggressive Accumulation' },
    { name: 'Morning Swing Session (10:30 - 12:00)', volPct: 22, momentum: '+0.60%', sentiment: 'Trend Continuation' },
    { name: 'Midday Algorithmic Lull (12:00 - 14:00)', volPct: 12, momentum: '-0.15%', sentiment: 'Range Consolidation' },
    { name: 'Afternoon Institutional Flow (14:00 - 15:30)', volPct: 16, momentum: '+0.75%', sentiment: 'VWAP Defense' },
    { name: 'Closing Power Hour (15:30 - 16:00)', volPct: 28, momentum: '+1.12%', sentiment: 'Breakout Extension' },
  ];

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col space-y-6 p-5">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-black text-white tracking-tight">
              Time Horizon Performance Scanner: <span className="text-emerald-400 font-mono">{selectedStock.symbol}</span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Compare statistical edge, volatility, and order flow dynamics across Seconds, Minutes, and Days.
          </p>
        </div>

        {/* Horizon Tabs */}
        <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveHorizon('seconds')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all ${
              activeHorizon === 'seconds'
                ? 'bg-emerald-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Seconds (High-Freq)
          </button>
          <button
            onClick={() => setActiveHorizon('minutes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all ${
              activeHorizon === 'minutes'
                ? 'bg-emerald-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Minutes (Intraday)
          </button>
          <button
            onClick={() => setActiveHorizon('days')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold transition-all ${
              activeHorizon === 'days'
                ? 'bg-emerald-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Day by Day (Swing)
          </button>
        </div>
      </div>

      {/* SECONDS MODE */}
      {activeHorizon === 'seconds' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono text-zinc-400">Tick Speed / Frequency</span>
              <div className="my-2">
                <span className="text-3xl font-black font-mono text-emerald-400">800 ms</span>
                <span className="text-zinc-500 text-xs ml-2">(1.25 ticks/sec)</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Brownian micro-volatility model calibrated to {selectedStock.symbol} Beta ({selectedStock.beta.toFixed(2)}).
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono text-zinc-400">Order Book Imbalance (Bids vs Asks)</span>
              <div className="my-2 flex items-center gap-2">
                <span className="text-2xl font-black font-mono text-emerald-400">64% Buy</span>
                <span className="text-zinc-500">/</span>
                <span className="text-xl font-bold font-mono text-rose-400">36% Sell</span>
              </div>
              <div className="h-2 w-full bg-rose-500/30 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '64%' }} />
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
              <span className="text-[10px] uppercase font-mono text-zinc-400">1-Second Momentum Drift</span>
              <div className="my-2">
                <span
                  className={`text-2xl font-black font-mono ${
                    selectedStock.secondChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {selectedStock.secondChangePercent >= 0 ? '+' : ''}
                  {selectedStock.secondChangePercent.toFixed(2)}%
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Pulsing high-frequency directional bias: {selectedStock.tickDirection.toUpperCase()}.
              </p>
            </div>
          </div>

          {/* High-frequency streaming ticker comparison */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Second-by-Second Velocity Leaderboard
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              {stocks.slice(0, 8).map((stk) => (
                <div
                  key={stk.symbol}
                  onClick={() => setSelectedStock(stk)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    stk.symbol === selectedStock.symbol
                      ? 'bg-zinc-800 border-emerald-500/50'
                      : 'bg-zinc-950 border-zinc-800 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{stk.symbol}</span>
                    <span
                      className={`text-[11px] font-bold ${
                        stk.secondChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {stk.secondChangePercent >= 0 ? '+' : ''}{stk.secondChangePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-1 flex justify-between">
                    <span>${stk.price.toFixed(2)}</span>
                    <span className="text-zinc-500">{(stk.volume / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MINUTES MODE */}
      {activeHorizon === 'minutes' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <span className="text-[10px] uppercase font-mono text-zinc-400">1-Minute Intraday Delta</span>
              <div className="text-2xl font-black font-mono text-emerald-400 my-1">
                {selectedStock.minuteChangePercent >= 0 ? '+' : ''}{selectedStock.minuteChangePercent.toFixed(2)}%
              </div>
              <p className="text-[11px] text-zinc-400">Rolling 60-second window performance.</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <span className="text-[10px] uppercase font-mono text-zinc-400">Intraday High / Low Range</span>
              <div className="text-lg font-bold font-mono text-white my-1">
                ${selectedStock.low.toFixed(2)} - ${selectedStock.high.toFixed(2)}
              </div>
              <p className="text-[11px] text-zinc-400">
                Range spread: ${(selectedStock.high - selectedStock.low).toFixed(2)} (
                {(((selectedStock.high - selectedStock.low) / selectedStock.low) * 100).toFixed(1)}%)
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <span className="text-[10px] uppercase font-mono text-zinc-400">Day Volume Run-Rate</span>
              <div className="text-lg font-bold font-mono text-cyan-400 my-1">
                {(selectedStock.volume / selectedStock.avgVolume * 100).toFixed(0)}% of Average
              </div>
              <p className="text-[11px] text-zinc-400">Pacing above 30-day baseline.</p>
            </div>
          </div>

          {/* Intraday Sessions Breakdown */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Trading Session Volume & Momentum Clusters
            </h3>
            <div className="space-y-2 text-xs font-mono">
              {minuteSessions.map((s, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-bold text-zinc-200">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-[11px]">
                    <span className="text-zinc-400">
                      Vol: <strong className="text-zinc-200">{s.volPct}%</strong>
                    </span>
                    <span className="text-emerald-400 font-bold">{s.momentum}</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                      {s.sentiment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DAYS MODE */}
      {activeHorizon === 'days' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-mono text-zinc-400">30-Day Win Rate</span>
              <div className="text-2xl font-black font-mono text-emerald-400 my-1">{winRate}%</div>
              <p className="text-[11px] text-zinc-400">{greenDays} green / 30 sessions</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-mono text-zinc-400">Best Trading Day</span>
              <div className="text-2xl font-black font-mono text-emerald-400 my-1">+{bestDay}%</div>
              <p className="text-[11px] text-zinc-400">Earnings momentum surge</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-mono text-zinc-400">Worst Trading Day</span>
              <div className="text-2xl font-black font-mono text-rose-400 my-1">{worstDay}%</div>
              <p className="text-[11px] text-zinc-400">Macro CPI market pullback</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5">
              <span className="text-[10px] uppercase font-mono text-zinc-400">Estimated Sharpe Ratio</span>
              <div className="text-2xl font-black font-mono text-cyan-400 my-1">2.14</div>
              <p className="text-[11px] text-zinc-400">Top decile risk-adjusted return</p>
            </div>
          </div>

          {/* 30-Day Calendar Return Grid */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>30-Day Performance Calendar Heatmap</span>
              <span className="text-[11px] font-mono text-zinc-400">Daily Return %</span>
            </h3>

            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
              {calendarDays.map((d) => (
                <div
                  key={d.day}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    d.isGreen
                      ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                  }`}
                >
                  <div className="text-[10px] text-zinc-400 font-mono">D-{31 - d.day}</div>
                  <div className="text-xs font-bold font-mono mt-0.5">
                    {d.delta >= 0 ? '+' : ''}{d.delta}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-between border-t border-zinc-800 pt-4 text-xs">
        <span className="text-zinc-400">
          Ready to trade or analyze {selectedStock.symbol} based on time horizon data?
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => requestStockAnalysis(selectedStock)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Intel</span>
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-colors"
          >
            <span>Open Chart & Trade</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
