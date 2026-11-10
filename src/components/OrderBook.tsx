import React, { useState } from 'react';
import { Layers, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTrading } from '../context/TradingContext';

export const OrderBook: React.FC = () => {
  const { selectedStock, orderBook, recentTrades } = useTrading();
  const [tab, setTab] = useState<'book' | 'tape'>('book');

  // Max cumulative size for depth background bar calculation
  const maxBidTotal = orderBook.bids[orderBook.bids.length - 1]?.total || 1;
  const maxAskTotal = orderBook.asks[orderBook.asks.length - 1]?.total || 1;
  const maxTotal = Math.max(maxBidTotal, maxAskTotal);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-[510px] shadow-xl">
      {/* Tab Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/70 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTab('book')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
              tab === 'book'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Order Book (L2)
          </button>
          <button
            onClick={() => setTab('tape')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-colors ${
              tab === 'tape'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Time & Sales
          </button>
        </div>

        <div className="text-[10px] font-mono text-zinc-400">
          Spread: <span className="text-zinc-200 font-bold">${orderBook.spread.toFixed(2)}</span> ({orderBook.spreadPercent.toFixed(3)}%)
        </div>
      </div>

      {/* Content based on tab */}
      {tab === 'book' ? (
        <div className="flex-1 flex flex-col p-3 overflow-hidden text-xs font-mono">
          {/* Header Row */}
          <div className="grid grid-cols-3 text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-1.5 border-b border-zinc-800/80">
            <span>Price (USD)</span>
            <span className="text-right">Size</span>
            <span className="text-right">Total</span>
          </div>

          {/* Asks (Sell Orders) - Red descending */}
          <div className="flex-1 flex flex-col justify-end overflow-hidden py-1 space-y-0.5">
            {orderBook.asks.slice(0, 6).reverse().map((ask, idx) => {
              const depthPct = (ask.total / maxTotal) * 100;
              return (
                <div
                  key={`ask-${idx}`}
                  className="relative grid grid-cols-3 py-0.5 px-1 rounded hover:bg-zinc-900/60"
                >
                  {/* Depth visual bar */}
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-rose-500/15 pointer-events-none rounded"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="text-rose-400 font-bold relative z-10">${ask.price.toFixed(2)}</span>
                  <span className="text-right text-zinc-300 relative z-10">{ask.size.toLocaleString()}</span>
                  <span className="text-right text-zinc-500 relative z-10">{ask.total.toLocaleString()}</span>
                </div>
              );
            })}
          </div>

          {/* Spread / Mid Market Banner */}
          <div className="py-2 px-3 my-1 bg-zinc-900/90 border-y border-zinc-800 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-white">
                ${selectedStock.price.toFixed(2)}
              </span>
              <span
                className={`text-[11px] font-bold flex items-center ${
                  selectedStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {selectedStock.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                {selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-[10px] text-zinc-400">
              Mid Market Price
            </div>
          </div>

          {/* Bids (Buy Orders) - Green descending */}
          <div className="flex-1 overflow-hidden py-1 space-y-0.5">
            {orderBook.bids.slice(0, 6).map((bid, idx) => {
              const depthPct = (bid.total / maxTotal) * 100;
              return (
                <div
                  key={`bid-${idx}`}
                  className="relative grid grid-cols-3 py-0.5 px-1 rounded hover:bg-zinc-900/60"
                >
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-emerald-500/15 pointer-events-none rounded"
                    style={{ width: `${depthPct}%` }}
                  />
                  <span className="text-emerald-400 font-bold relative z-10">${bid.price.toFixed(2)}</span>
                  <span className="text-right text-zinc-300 relative z-10">{bid.size.toLocaleString()}</span>
                  <span className="text-right text-zinc-500 relative z-10">{bid.total.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Time and Sales Tape */
        <div className="flex-1 flex flex-col p-3 overflow-hidden text-xs font-mono">
          <div className="grid grid-cols-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider pb-1.5 border-b border-zinc-800/80">
            <span>Time</span>
            <span className="text-right">Price</span>
            <span className="text-right">Size</span>
            <span className="text-right">Side</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 py-1 scrollbar-thin">
            {recentTrades.map((trade) => {
              const isBuy = trade.side === 'buy';
              return (
                <div
                  key={trade.id}
                  className="grid grid-cols-4 py-1 px-1 rounded hover:bg-zinc-900/60 transition-colors"
                >
                  <span className="text-zinc-500 text-[11px]">{trade.time}</span>
                  <span
                    className={`text-right font-bold ${
                      isBuy ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    ${trade.price.toFixed(2)}
                  </span>
                  <span className="text-right text-zinc-300">{trade.size.toLocaleString()}</span>
                  <span
                    className={`text-right font-bold text-[10px] ${
                      isBuy ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isBuy ? 'BUY (ASK)' : 'SELL (BID)'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
