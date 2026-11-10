import React, { useState } from 'react';
import {
  X,
  Bell,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

export const PriceAlertsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    stocks,
    selectedStock,
    alerts,
    addAlert,
    removeAlert,
  } = useTrading();

  const [symbol, setSymbol] = useState(selectedStock.symbol);
  const [targetPrice, setTargetPrice] = useState<number>(+(selectedStock.price * 1.05).toFixed(2));
  const [direction, setDirection] = useState<'above' | 'below'>('above');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const currentStockRef = stocks.find((s) => s.symbol === symbol) || selectedStock;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetPrice <= 0) return;
    addAlert(symbol, targetPrice, direction, notes || `${direction === 'above' ? 'Breakout' : 'Support'} alert`);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-xs">
        {/* Header */}
        <div className="border-b border-zinc-800 bg-zinc-900/80 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Price Alerts & Notification Engine</h3>
              <p className="text-[11px] text-zinc-400">Trigger real-time chimes when stocks cross target prices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Create Alert Form */}
        <form onSubmit={handleCreate} className="p-5 border-b border-zinc-800 bg-zinc-900/40 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Asset
              </label>
              <select
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value);
                  const s = stocks.find((st) => st.symbol === e.target.value);
                  if (s) {
                    setTargetPrice(+(s.price * 1.05).toFixed(2));
                  }
                }}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              >
                {stocks.map((s) => (
                  <option key={s.symbol} value={s.symbol}>
                    {s.symbol} (${s.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Trigger Direction
              </label>
              <div className="grid grid-cols-2 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setDirection('above')}
                  className={`py-1 rounded flex items-center justify-center gap-1 ${
                    direction === 'above' ? 'bg-emerald-500 text-zinc-950 font-bold' : 'text-zinc-400'
                  }`}
                >
                  <ArrowUp className="w-3 h-3" />
                  Above
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('below')}
                  className={`py-1 rounded flex items-center justify-center gap-1 ${
                    direction === 'below' ? 'bg-rose-500 text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  <ArrowDown className="w-3 h-3" />
                  Below
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Target Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Note / Catalyst
              </label>
              <input
                type="text"
                placeholder="e.g. Breakout retest"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Price Alert</span>
          </button>
        </form>

        {/* Existing Alerts List */}
        <div className="p-5 max-h-64 overflow-y-auto space-y-2">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Configured Alerts ({alerts.length})
          </h4>

          {alerts.length === 0 ? (
            <div className="py-6 text-center text-zinc-500">
              No active alerts. Create one above to get notified as prices move.
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-2.5 flex items-center justify-between font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">{alert.symbol}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        alert.direction === 'above'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {alert.direction.toUpperCase()} ${alert.targetPrice.toFixed(2)}
                    </span>
                    {alert.triggered && (
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> TRIGGERED
                      </span>
                    )}
                  </div>
                  {alert.notes && (
                    <div className="text-[10px] text-zinc-400 font-sans mt-0.5">
                      {alert.notes}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => removeAlert(alert.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
