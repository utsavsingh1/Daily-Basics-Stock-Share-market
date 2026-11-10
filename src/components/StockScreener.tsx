import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ArrowUpDown,
  Flame,
  LayoutGrid,
  List,
} from 'lucide-react';
import { StockQuote } from '../types/market';
import { useTrading } from '../context/TradingContext';

export const StockScreener: React.FC = () => {
  const { stocks, setSelectedStock, setActiveTab, requestStockAnalysis } = useTrading();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof StockQuote>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'heatmap'>('table');

  const sectors = ['All', 'Tech & AI', 'Semiconductors', 'Consumer & Auto', 'Enterprise & Cloud', 'Crypto & FinTech', 'ETFs & Indexes'];

  const filteredStocks = useMemo(() => {
    return stocks
      .filter((s) => {
        const matchesSearch =
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector = selectedSector === 'All' || s.sector === selectedSector;
        return matchesSearch && matchesSector;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'desc' ? valB - valA : valA - valB;
        }
        return 0;
      });
  }, [stocks, searchQuery, selectedSector, sortField, sortOrder]);

  const handleSort = (field: keyof StockQuote) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAndTrade = (stock: StockQuote) => {
    setSelectedStock(stock);
    setActiveTab('terminal');
  };

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
      {/* Screener Header Bar */}
      <div className="border-b border-zinc-800 bg-zinc-900/70 p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              Real-Time Stock Screener & Market Scanner
            </h2>
            <span className="text-xs font-mono text-zinc-400">
              ({filteredStocks.length} tracked assets)
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Streaming second-by-second micro-volatility, day performance, and quantitative valuation metrics.
          </p>
        </div>

        {/* Search, Filter & View Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search ticker or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${
                viewMode === 'table' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`p-1.5 rounded ${
                viewMode === 'heatmap' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Heatmap View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sector Pills */}
      <div className="border-b border-zinc-800/80 bg-zinc-950 px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec)}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium transition-colors ${
              selectedSector === sec
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* View Mode: Table */}
      {viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-[10px] uppercase font-bold text-zinc-400">
                <th className="py-2.5 px-4">
                  <button onClick={() => handleSort('symbol')} className="flex items-center gap-1 hover:text-white">
                    Asset <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3 text-right">
                  <button onClick={() => handleSort('price')} className="flex items-center gap-1 justify-end hover:text-white">
                    Live Price <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3 text-right">
                  <button onClick={() => handleSort('secondChangePercent')} className="flex items-center gap-1 justify-end hover:text-white">
                    1s Tick <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3 text-right">
                  <button onClick={() => handleSort('minuteChangePercent')} className="flex items-center gap-1 justify-end hover:text-white">
                    1m Delta <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3 text-right">
                  <button onClick={() => handleSort('changePercent')} className="flex items-center gap-1 justify-end hover:text-white">
                    Day Change <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3 text-right hidden md:table-cell">
                  <button onClick={() => handleSort('volume')} className="flex items-center gap-1 justify-end hover:text-white">
                    Volume <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-2.5 px-3 text-right hidden lg:table-cell">Market Cap</th>
                <th className="py-2.5 px-3 text-right hidden xl:table-cell">Beta</th>
                <th className="py-2.5 px-3 hidden lg:table-cell text-center">52W Range</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredStocks.map((stock) => {
                const isPos = stock.change >= 0;
                const isSecPos = stock.secondChangePercent >= 0;
                const isMinPos = stock.minuteChangePercent >= 0;

                // 52-week position indicator
                const range52 = stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow || 1;
                const pct52 = Math.max(0, Math.min(100, ((stock.price - stock.fiftyTwoWeekLow) / range52) * 100));

                return (
                  <tr
                    key={stock.symbol}
                    className="hover:bg-zinc-900/50 transition-colors group cursor-pointer"
                    onClick={() => handleSelectAndTrade(stock)}
                  >
                    {/* Ticker & Name */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {stock.symbol}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-sans truncate max-w-[140px] hidden sm:inline">
                          {stock.name}
                        </span>
                      </div>
                    </td>

                    {/* Live Price */}
                    <td className="py-3 px-3 text-right font-extrabold text-white">
                      ${stock.price.toFixed(2)}
                    </td>

                    {/* 1s Tick */}
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                          stock.tickDirection === 'up'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : stock.tickDirection === 'down'
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'text-zinc-400'
                        }`}
                      >
                        {isSecPos ? '+' : ''}
                        {stock.secondChangePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* 1m Delta */}
                    <td className="py-3 px-3 text-right">
                      <span className={`font-semibold ${isMinPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isMinPos ? '+' : ''}
                        {stock.minuteChangePercent.toFixed(2)}%
                      </span>
                    </td>

                    {/* Day Change */}
                    <td className="py-3 px-3 text-right">
                      <div
                        className={`font-bold flex items-center justify-end ${
                          isPos ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isPos ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                        {isPos ? '+' : ''}${stock.change.toFixed(2)} ({isPos ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%)
                      </div>
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right text-zinc-300 hidden md:table-cell">
                      {(stock.volume / 1000000).toFixed(2)}M
                    </td>

                    {/* Market Cap */}
                    <td className="py-3 px-3 text-right text-zinc-400 hidden lg:table-cell">
                      {stock.marketCap}
                    </td>

                    {/* Beta */}
                    <td className="py-3 px-3 text-right text-zinc-300 hidden xl:table-cell">
                      {stock.beta.toFixed(2)}
                    </td>

                    {/* 52W Range Bar */}
                    <td className="py-3 px-3 hidden lg:table-cell">
                      <div className="w-24 mx-auto">
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                            style={{ width: `${pct52}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-zinc-500 mt-0.5">
                          <span>${stock.fiftyTwoWeekLow.toFixed(0)}</span>
                          <span>${stock.fiftyTwoWeekHigh.toFixed(0)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => requestStockAnalysis(stock)}
                          className="p-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 transition-colors"
                          title="Instant AI Analysis"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSelectAndTrade(stock)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-sans font-semibold text-[11px] transition-colors"
                        >
                          Trade
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Heatmap Grid View */
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredStocks.map((stock) => {
            const isPos = stock.change >= 0;
            const intensity = Math.min(1, Math.abs(stock.changePercent) / 5);

            return (
              <div
                key={stock.symbol}
                onClick={() => handleSelectAndTrade(stock)}
                className={`p-3 rounded-xl border transition-all cursor-pointer hover:scale-[1.02] flex flex-col justify-between ${
                  isPos
                    ? 'bg-emerald-950/30 border-emerald-800/40 hover:border-emerald-500/60'
                    : 'bg-rose-950/30 border-rose-800/40 hover:border-rose-500/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-base font-mono">{stock.symbol}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      requestStockAnalysis(stock);
                    }}
                    className="p-1 text-zinc-400 hover:text-emerald-400"
                    title="AI Analysis"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="my-2">
                  <div className="text-xl font-black font-mono text-white">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-mono font-bold flex items-center ${
                      isPos ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPos ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </div>
                </div>

                <div className="text-[10px] text-zinc-400 font-mono flex justify-between border-t border-zinc-800/60 pt-1.5">
                  <span>1s: {stock.secondChangePercent > 0 ? '+' : ''}{stock.secondChangePercent.toFixed(2)}%</span>
                  <span>Vol: {(stock.volume / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
