import React, { useState } from 'react';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Download,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { AIPortfolioReview } from '../types/market';
import { useTrading } from '../context/TradingContext';
import { fetchPortfolioInsights } from '../services/aiService';

export const PortfolioView: React.FC = () => {
  const {
    positions,
    cashBalance,
    totalPortfolioValue,
    totalProfitLoss,
    totalProfitLossPercent,
    dayProfitLoss,
    dayProfitLossPercent,
    orders,
    closePosition,
    setSelectedStock,
    setActiveTab,
    requestStockAnalysis,
  } = useTrading();

  const [aiReview, setAiReview] = useState<AIPortfolioReview | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState<boolean>(false);

  // Trigger CIO AI Review
  const handleRunPortfolioAudit = async () => {
    setIsLoadingReview(true);
    try {
      const review = await fetchPortfolioInsights(
        positions,
        cashBalance,
        totalPortfolioValue,
        totalProfitLoss,
        totalProfitLossPercent
      );
      setAiReview(review);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsLoadingReview(false);
    }
  };

  // Export orders to CSV
  const handleExportCSV = () => {
    const headers = 'ID,Date,Symbol,Side,Type,Shares,Price,TotalValue,Status\n';
    const rows = orders
      .map(
        (o) =>
          `${o.id},"${new Date(o.timestamp).toISOString()}",${o.symbol},${o.side},${o.type},${o.shares},${o.price},${o.totalValue},${o.status}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexTrade_Portfolio_Orders_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate sector weights
  const sectorWeights = positions.reduce((acc, p) => {
    acc[p.symbol] = (acc[p.symbol] || 0) + p.marketValue;
    return acc;
  }, {} as Record<string, number>);

  const isTotalPos = totalProfitLoss >= 0;
  const isDayPos = dayProfitLoss >= 0;

  return (
    <div className="space-y-6">
      {/* Portfolio Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Portfolio Value */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Net Portfolio Value</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <span className="text-2xl font-black font-mono text-white">
              ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
            <span>Cash: ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            <span className="text-emerald-400 font-bold">
              {((cashBalance / totalPortfolioValue) * 100).toFixed(1)}% Dry Powder
            </span>
          </div>
        </div>

        {/* Total Unrealized P&L */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Return (All-Time)</span>
            {isTotalPos ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
          </div>
          <div className="my-2">
            <span
              className={`text-2xl font-black font-mono ${
                isTotalPos ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isTotalPos ? '+' : ''}${totalProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Return on Capital: <span className={isTotalPos ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{isTotalPos ? '+' : ''}{totalProfitLossPercent}%</span>
          </div>
        </div>

        {/* Today's Return */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Day Return</span>
            {isDayPos ? <ArrowUpRight className="w-4 h-4 text-emerald-400" /> : <ArrowDownRight className="w-4 h-4 text-rose-400" />}
          </div>
          <div className="my-2">
            <span
              className={`text-2xl font-black font-mono ${
                isDayPos ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isDayPos ? '+' : ''}${dayProfitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="text-[11px] font-mono text-zinc-400">
            Intraday Delta: <span className={isDayPos ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>{isDayPos ? '+' : ''}{dayProfitLossPercent}%</span>
          </div>
        </div>

        {/* AI Health Score / Audit CTA */}
        <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              AI Risk Audit
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              {aiReview ? `${aiReview.riskRating}` : 'INSTITUTIONAL'}
            </span>
          </div>
          <div className="my-2 flex items-center justify-between">
            <div>
              <span className="text-3xl font-black font-mono text-white">
                {aiReview ? `${aiReview.portfolioHealthScore}` : '88'}
              </span>
              <span className="text-zinc-500 font-mono text-xs">/100</span>
            </div>
            <button
              onClick={handleRunPortfolioAudit}
              disabled={isLoadingReview}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoadingReview ? 'Auditing...' : 'Run AI Audit'}
            </button>
          </div>
          <div className="text-[10px] text-zinc-400 truncate">
            {aiReview ? aiReview.sectorAllocationReview : 'Quant engine ready to assess diversification & beta exposure.'}
          </div>
        </div>
      </div>

      {/* AI Portfolio Audit Results Panel (if loaded) */}
      {aiReview && (
        <div className="bg-zinc-950 border border-emerald-500/30 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Institutional AI Portfolio Diagnostic & Rebalance
                </h3>
                <p className="text-xs text-zinc-400">{aiReview.summary}</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Health Score: {aiReview.portfolioHealthScore}/100 ({aiReview.riskRating})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Top Strengths */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Portfolio Strengths
              </h4>
              <ul className="space-y-1.5 text-zinc-300">
                {aiReview.topStrengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Critical Vulnerabilities */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Risk Vulnerabilities
              </h4>
              <ul className="space-y-1.5 text-zinc-300">
                {aiReview.criticalVulnerabilities.map((vuln, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{vuln}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Rebalancing recommendations */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
              Actionable Position Adjustments & Hedging
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {aiReview.actionableRecommendations.map((rec, idx) => (
                <div key={idx} className="bg-zinc-950 border border-zinc-800/80 rounded p-2.5 flex items-start justify-between">
                  <div>
                    <span className="font-bold font-mono text-white text-xs">{rec.symbol}</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{rec.rationale}</p>
                  </div>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                      rec.recommendedAction.includes('BUY')
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : rec.recommendedAction.includes('TRIM')
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {rec.recommendedAction} ({rec.targetWeight})
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong className="text-zinc-200">Macro Hedging Tip:</strong> {aiReview.macroHedgingTip}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active Holdings Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="border-b border-zinc-800 bg-zinc-900/70 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Open Stock Positions ({positions.length})</h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            Total Market Value: ${positions.reduce((acc, p) => acc + p.marketValue, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {positions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No open stock positions. Go to the Trading Desk or Screener to execute buy orders.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/40 text-[10px] uppercase font-bold text-zinc-400">
                  <th className="py-2.5 px-4">Asset</th>
                  <th className="py-2.5 px-3 text-right">Shares</th>
                  <th className="py-2.5 px-3 text-right">Avg Cost</th>
                  <th className="py-2.5 px-3 text-right">Live Price</th>
                  <th className="py-2.5 px-3 text-right">Market Value</th>
                  <th className="py-2.5 px-3 text-right">Total P&L</th>
                  <th className="py-2.5 px-3 text-right">Day P&L</th>
                  <th className="py-2.5 px-4 text-center">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {positions.map((pos) => {
                  const isTotalProfitable = pos.unrealizedPL >= 0;
                  const isDayProfitable = pos.dayPL >= 0;

                  return (
                    <tr key={pos.symbol} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{pos.symbol}</span>
                          <span className="text-[11px] text-zinc-400 font-sans truncate max-w-[140px] hidden sm:inline">
                            {pos.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-zinc-200">
                        {pos.shares}
                      </td>
                      <td className="py-3 px-3 text-right text-zinc-300">
                        ${pos.avgPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white">
                        ${pos.currentPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-white">
                        ${pos.marketValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`font-bold ${
                            isTotalProfitable ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isTotalProfitable ? '+' : ''}${pos.unrealizedPL.toFixed(2)} ({isTotalProfitable ? '+' : ''}
                          {pos.unrealizedPLPercent}%)
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`font-semibold ${
                            isDayProfitable ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isDayProfitable ? '+' : ''}${pos.dayPL.toFixed(2)} ({isDayProfitable ? '+' : ''}
                          {pos.dayPLPercent}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedStock({
                                symbol: pos.symbol,
                                name: pos.name,
                                sector: 'Tech & AI',
                                price: pos.currentPrice,
                                previousClose: pos.currentPrice,
                                change: 0,
                                changePercent: 0,
                                high: pos.currentPrice * 1.02,
                                low: pos.currentPrice * 0.98,
                                volume: 1000000,
                                avgVolume: 1000000,
                                marketCap: '$1T',
                                peRatio: 30,
                                beta: 1.2,
                                fiftyTwoWeekHigh: pos.currentPrice * 1.2,
                                fiftyTwoWeekLow: pos.currentPrice * 0.8,
                                lastTickTime: Date.now(),
                                tickDirection: 'up',
                                secondChangePercent: 0,
                                minuteChangePercent: 0,
                                dayChangePercent: 0,
                              });
                              setActiveTab('terminal');
                            }}
                            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-sans font-semibold transition-colors"
                          >
                            Trade
                          </button>
                          <button
                            onClick={() => closePosition(pos.symbol)}
                            className="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-[10px] font-sans font-semibold transition-colors"
                          >
                            Exit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction & Order History */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="border-b border-zinc-800 bg-zinc-900/70 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Execution Log & Order History ({orders.length})</h3>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto max-h-72 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-[10px] uppercase font-bold text-zinc-400 sticky top-0">
                <th className="py-2.5 px-4">Time</th>
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3">Side</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Shares</th>
                <th className="py-2.5 px-3 text-right">Fill Price</th>
                <th className="py-2.5 px-3 text-right">Total USD</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-2.5 px-4 text-zinc-400">
                    {new Date(ord.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-white">{ord.symbol}</td>
                  <td className="py-2.5 px-3 font-bold">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        ord.side === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {ord.side}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-400">{ord.type}</td>
                  <td className="py-2.5 px-3 text-right text-zinc-200">{ord.shares}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-white">
                    ${ord.price.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-zinc-200">
                    ${ord.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    <span className="text-[10px] text-emerald-400 font-bold">FILLED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
