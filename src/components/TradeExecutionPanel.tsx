import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

export const TradeExecutionPanel: React.FC = () => {
  const {
    selectedStock,
    cashBalance,
    positions,
    executeOrder,
    closePosition,
  } = useTrading();

  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP_LOSS'>('MARKET');
  const [shares, setShares] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(selectedStock.price);
  const [stopPrice, setStopPrice] = useState<number>(+(selectedStock.price * 0.96).toFixed(2));
  const [enableBrackets, setEnableBrackets] = useState<boolean>(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(+(selectedStock.price * 1.08).toFixed(2));
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync default prices when selectedStock changes
  useEffect(() => {
    setLimitPrice(selectedStock.price);
    setStopPrice(+(selectedStock.price * 0.96).toFixed(2));
    setTakeProfitPrice(+(selectedStock.price * 1.08).toFixed(2));
  }, [selectedStock.symbol]);

  const currentPos = positions.find((p) => p.symbol === selectedStock.symbol);
  const effectivePrice = orderType === 'LIMIT' ? limitPrice : selectedStock.price;
  const estimatedTotal = +(shares * effectivePrice).toFixed(2);
  const maxAffordableShares = Math.floor(cashBalance / effectivePrice);

  // Quick percent size helper
  const handlePercentSize = (pct: number) => {
    if (side === 'BUY') {
      const budget = cashBalance * pct;
      const count = Math.max(1, Math.floor(budget / effectivePrice));
      setShares(count);
    } else {
      if (currentPos) {
        const count = Math.max(1, Math.floor(currentPos.shares * pct));
        setShares(count);
      }
    }
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (shares <= 0) {
      setFeedback({ type: 'error', message: 'Share count must be greater than 0' });
      return;
    }

    const res = executeOrder({
      symbol: selectedStock.symbol,
      side,
      type: orderType,
      shares,
      limitPrice: orderType === 'LIMIT' ? limitPrice : undefined,
      stopPrice: orderType === 'STOP_LOSS' ? stopPrice : undefined,
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: 'error', message: res.message });
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  // Risk/Reward ratio calculation for brackets
  const riskAmount = effectivePrice - stopPrice;
  const rewardAmount = takeProfitPrice - effectivePrice;
  const riskRewardRatio = riskAmount > 0 && rewardAmount > 0 ? (rewardAmount / riskAmount).toFixed(1) : null;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/70 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Trade Execution Ticket</span>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Available Cash: <span className="text-zinc-200 font-bold">${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </span>
      </div>

      <form onSubmit={handleExecute} className="p-4 flex flex-col gap-3.5 text-xs">
        {/* Buy / Sell Switch */}
        <div className="grid grid-cols-2 p-1 bg-zinc-900 rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => setSide('BUY')}
            className={`py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${
              side === 'BUY'
                ? 'bg-emerald-500 text-zinc-950 shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Buy (Long)
          </button>
          <button
            type="button"
            onClick={() => setSide('SELL')}
            className={`py-2 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${
              side === 'SELL'
                ? 'bg-rose-500 text-white shadow-md font-extrabold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Sell (Exit)
          </button>
        </div>

        {/* Order Type Tabs */}
        <div>
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
            Order Type
          </div>
          <div className="grid grid-cols-3 gap-1.5 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-[11px]">
            <button
              type="button"
              onClick={() => setOrderType('MARKET')}
              className={`py-1 rounded text-center font-medium transition-colors ${
                orderType === 'MARKET' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Market
            </button>
            <button
              type="button"
              onClick={() => setOrderType('LIMIT')}
              className={`py-1 rounded text-center font-medium transition-colors ${
                orderType === 'LIMIT' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Limit
            </button>
            <button
              type="button"
              onClick={() => setOrderType('STOP_LOSS')}
              className={`py-1 rounded text-center font-medium transition-colors ${
                orderType === 'STOP_LOSS' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Stop-Loss
            </button>
          </div>
        </div>

        {/* Limit Price Input (if applicable) */}
        {orderType === 'LIMIT' && (
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Limit Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-zinc-500 font-mono">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 pl-7 pr-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Stop Price Input (if applicable) */}
        {orderType === 'STOP_LOSS' && (
          <div>
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
              Stop Trigger Price (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-zinc-500 font-mono">$</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={stopPrice}
                onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 pl-7 pr-3 text-white font-mono text-xs focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        )}

        {/* Share Quantity & Quick Sizing */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Quantity (Shares)
            </label>
            <span className="text-[10px] font-mono text-zinc-500">
              Max: {side === 'BUY' ? maxAffordableShares : currentPos?.shares || 0} shares
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={shares}
              onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick percent sizing pills */}
          <div className="grid grid-cols-4 gap-1 mt-1.5">
            {[0.25, 0.5, 0.75, 1.0].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentSize(pct)}
                className="py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-[10px] font-mono border border-zinc-800/80 transition-colors"
              >
                {pct === 1.0 ? 'MAX' : `${pct * 100}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Bracket Protection Toggle */}
        <div className="border border-zinc-800/80 rounded-lg p-2.5 bg-zinc-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Bracket Protection (TP/SL)
            </span>
            <input
              type="checkbox"
              checked={enableBrackets}
              onChange={(e) => setEnableBrackets(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-emerald-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {enableBrackets && (
            <div className="mt-2.5 pt-2.5 border-t border-zinc-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-emerald-400 block mb-0.5">
                    Take Profit ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={takeProfitPrice}
                    onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-mono text-rose-400 block mb-0.5">
                    Stop Loss ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={stopPrice}
                    onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] font-mono text-white"
                  />
                </div>
              </div>
              {riskRewardRatio && (
                <div className="text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                  <span>Risk / Reward:</span>
                  <span className="text-emerald-400 font-bold">1 : {riskRewardRatio} R:R</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Preview / Financials */}
        <div className="bg-zinc-900/80 rounded-lg p-2.5 border border-zinc-800 space-y-1.5 font-mono text-[11px]">
          <div className="flex justify-between text-zinc-400">
            <span>Execution Price:</span>
            <span className="text-zinc-200 font-semibold">${effectivePrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Commission & Fees:</span>
            <span className="text-emerald-400 font-semibold">$0.00 (Zero Commission)</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Est. Slippage:</span>
            <span className="text-zinc-300">~0.01%</span>
          </div>
          <div className="h-px bg-zinc-800 my-1" />
          <div className="flex justify-between text-white font-bold text-xs">
            <span>Estimated Total:</span>
            <span className="text-emerald-400 font-mono text-sm">${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Place Order CTA Button */}
        <button
          type="submit"
          className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
            side === 'BUY'
              ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/25'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/25'
          }`}
        >
          <span>
            {side} {shares} {selectedStock.symbol}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Current Position Quick Close */}
        {currentPos && (
          <div className="mt-1 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-zinc-400 text-[10px]">Your Position: </span>
              <span className="font-mono font-bold text-zinc-200">
                {currentPos.shares} sh @ ${currentPos.avgPrice.toFixed(2)}
              </span>
              <span
                className={`ml-2 font-mono font-bold text-[11px] ${
                  currentPos.unrealizedPL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ({currentPos.unrealizedPL >= 0 ? '+' : ''}${currentPos.unrealizedPL.toFixed(2)})
              </span>
            </div>
            <button
              type="button"
              onClick={() => closePosition(selectedStock.symbol)}
              className="text-[10px] font-bold text-rose-400 hover:text-rose-300 underline"
            >
              Close All
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
