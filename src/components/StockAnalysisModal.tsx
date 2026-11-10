import React from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Target,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

export const StockAnalysisModal: React.FC = () => {
  const {
    selectedStock,
    stockAnalysisModalOpen,
    setStockAnalysisModalOpen,
    isAnalyzingStock,
    aiAnalysis,
    setActiveTab,
  } = useTrading();

  if (!stockAnalysisModalOpen) return null;

  const ratingColors = {
    STRONG_BUY: 'bg-emerald-500 text-zinc-950 border-emerald-400',
    BUY: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    HOLD: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    SELL: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    STRONG_SELL: 'bg-rose-600 text-white border-rose-500',
  };

  const ratingBadgeClass = aiAnalysis?.rating ? ratingColors[aiAnalysis.rating] || ratingColors.BUY : ratingColors.BUY;

  // Short-term and long-term upside calculations
  const shortTermUpside = aiAnalysis
    ? (((aiAnalysis.targetPriceShortTerm - selectedStock.price) / selectedStock.price) * 100).toFixed(1)
    : '4.5';
  const longTermUpside = aiAnalysis
    ? (((aiAnalysis.targetPriceLongTerm - selectedStock.price) / selectedStock.price) * 100).toFixed(1)
    : '18.2';

  const handleApplyToTicket = () => {
    setStockAnalysisModalOpen(false);
    setActiveTab('terminal');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="border-b border-zinc-800 bg-zinc-900/80 px-5 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  Institutional AI Deep Dive: {selectedStock.symbol}
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  ${selectedStock.price.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Powered by Gemini 3.8 Flash Quantitative Analyst Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setStockAnalysisModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs">
          {isAnalyzingStock ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-semibold text-zinc-200">
                Running Multi-Factor Quantitative Model on {selectedStock.symbol}...
              </p>
              <p className="text-xs text-zinc-400 max-w-sm">
                Parsing real-time order book flow, RSI, MACD divergences, support shelves, and sector catalysts.
              </p>
            </div>
          ) : aiAnalysis ? (
            <>
              {/* Verdict & Rating Hero */}
              <div className="bg-gradient-to-r from-zinc-900 to-zinc-900/40 border border-zinc-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-extrabold font-mono border ${ratingBadgeClass}`}>
                      {aiAnalysis.rating.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      Confidence: <strong className="text-white">{aiAnalysis.confidenceScore}%</strong>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1.5">
                    {aiAnalysis.verdictTitle}
                  </h4>
                </div>

                <div className="flex items-center gap-3 font-mono">
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-zinc-400 block">Short Target</span>
                    <span className="text-sm font-bold text-emerald-400">
                      ${aiAnalysis.targetPriceShortTerm.toFixed(2)} (+{shortTermUpside}%)
                    </span>
                  </div>
                  <div className="h-8 w-px bg-zinc-800" />
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-zinc-400 block">Stop Loss</span>
                    <span className="text-sm font-bold text-rose-400">
                      ${aiAnalysis.stopLossSuggestion.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="text-zinc-300 leading-relaxed bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4 text-xs">
                <span className="font-bold text-white block mb-1">Executive Thesis:</span>
                {aiAnalysis.summary}
              </div>

              {/* Technical Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-2.5">
                  <span className="text-[10px] text-zinc-400 block">Support Shelf</span>
                  <span className="text-xs font-bold text-emerald-400">
                    ${aiAnalysis.technicalBreakdown.supportLevel}
                  </span>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-2.5">
                  <span className="text-[10px] text-zinc-400 block">Resistance Band</span>
                  <span className="text-xs font-bold text-rose-400">
                    ${aiAnalysis.technicalBreakdown.resistanceLevel}
                  </span>
                </div>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-2.5 col-span-2">
                  <span className="text-[10px] text-zinc-400 block">Momentum Signal</span>
                  <span className="text-xs font-bold text-cyan-300 truncate block">
                    {aiAnalysis.technicalBreakdown.indicatorSignal}
                  </span>
                </div>
              </div>

              {/* Catalysts & Risks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Catalysts */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                  <h5 className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Catalysts
                  </h5>
                  <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                    {aiAnalysis.catalysts.map((cat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risks */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3.5 space-y-2">
                  <h5 className="font-bold text-rose-400 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Key Risk Factors
                  </h5>
                  <ul className="space-y-1.5 text-zinc-300 text-[11px]">
                    {aiAnalysis.risks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tactical Plays: Day Trade vs Swing Trade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5">
                  <h5 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5" />
                    Day Scalp / Intraday Setup
                  </h5>
                  <p className="text-[11px] text-zinc-300">{aiAnalysis.dayTradingPlay}</p>
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5">
                  <h5 className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Swing / Multi-Day Setup
                  </h5>
                  <p className="text-[11px] text-zinc-300">{aiAnalysis.swingTradingPlay}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center text-zinc-400">
              Click Run AI Analysis to generate recommendations for {selectedStock.symbol}.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-zinc-800 bg-zinc-900/80 px-5 py-3 flex items-center justify-between sticky bottom-0 backdrop-blur-md">
          <span className="text-[11px] font-mono text-zinc-400">
            Current Price: <strong className="text-white">${selectedStock.price.toFixed(2)}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStockAnalysisModalOpen(false)}
              className="px-3 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleApplyToTicket}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <span>Load Into Trade Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
