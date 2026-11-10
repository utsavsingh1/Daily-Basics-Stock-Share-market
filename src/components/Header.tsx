import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Bot,
  Bell,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  BarChart3,
  PieChart,
  Layers,
  Clock,
  Radio,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

export const Header: React.FC<{
  onOpenAlerts: () => void;
}> = ({ onOpenAlerts }) => {
  const {
    stocks,
    selectedStock,
    setSelectedStock,
    cashBalance,
    totalPortfolioValue,
    dayProfitLoss,
    dayProfitLossPercent,
    soundEnabled,
    setSoundEnabled,
    resetAccount,
    requestStockAnalysis,
    isCopilotOpen,
    setIsCopilotOpen,
    activeTab,
    setActiveTab,
    alerts,
  } = useTrading();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlertsCount = alerts.filter((a) => !a.triggered).length;

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md sticky top-0 z-40 select-none">
      {/* Top High-Speed Ticker Ribbon */}
      <div className="border-b border-zinc-800/60 bg-zinc-900/50 px-3 py-1 text-xs overflow-x-auto flex items-center gap-6 scrollbar-none whitespace-nowrap">
        <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px] shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-semibold tracking-wider">LIVE FEED</span>
          <span className="text-zinc-500">|</span>
          <span className="text-zinc-300">{currentTime}</span>
        </div>

        <div className="flex items-center gap-5 text-xs">
          {stocks.slice(0, 8).map((stk) => {
            const isPos = stk.change >= 0;
            const isSelected = stk.symbol === selectedStock.symbol;
            return (
              <button
                key={stk.symbol}
                onClick={() => setSelectedStock(stk)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all ${
                  isSelected ? 'bg-zinc-800 border border-zinc-700' : 'hover:bg-zinc-800/40'
                }`}
              >
                <span className="font-semibold text-zinc-200">{stk.symbol}</span>
                <span className="font-mono text-zinc-300">${stk.price.toFixed(2)}</span>
                <span
                  className={`flex items-center font-mono text-[11px] ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isPos ? '+' : ''}
                  {stk.changePercent.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Navigation & Metric Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Market Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <div className="h-full w-full bg-zinc-950 rounded-[7px] flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                  ApexTrade <span className="text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">AI PRO</span>
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium">Real-Time Data & Portfolio Intelligence</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 ml-4 pl-4 border-l border-zinc-800">
            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'terminal'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Trading Desk
            </button>

            <button
              onClick={() => setActiveTab('screener')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'screener'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Stock Screener
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              Portfolio & Risk
            </button>

            <button
              onClick={() => setActiveTab('timeHorizon')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'timeHorizon'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Horizon Scanner
            </button>

            <button
              onClick={() => setActiveTab('marketPulse')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === 'marketPulse'
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              AI Market Pulse
            </button>
          </div>
        </div>

        {/* Portfolio Live Quick Metrics */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-lg px-3 py-1.5">
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-400">Net Portfolio</div>
              <div className="text-sm font-bold font-mono text-white tracking-tight">
                ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="h-6 w-px bg-zinc-800" />

            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-400">Day Return</div>
              <div
                className={`text-xs font-bold font-mono flex items-center ${
                  dayProfitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {dayProfitLoss >= 0 ? '+' : ''}${dayProfitLoss.toFixed(2)} ({dayProfitLossPercent >= 0 ? '+' : ''}
                {dayProfitLossPercent.toFixed(2)}%)
              </div>
            </div>

            <div className="h-6 w-px bg-zinc-800" />

            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-400">Buying Power</div>
              <div className="text-xs font-bold font-mono text-zinc-300">
                ${(cashBalance * 2).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => requestStockAnalysis(selectedStock)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/10 transition-all active:scale-95"
              title="Run Institutional AI Stock Analysis"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden md:inline">AI Intel ({selectedStock.symbol})</span>
              <span className="md:hidden">AI Intel</span>
            </button>

            <button
              onClick={() => setIsCopilotOpen(!isCopilotOpen)}
              className={`p-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 ${
                isCopilotOpen
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
              }`}
              title="Toggle Apex Copilot AI Chat"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">Apex Copilot</span>
            </button>

            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors"
              title="Price Alerts"
            >
              <Bell className="w-4 h-4" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-zinc-950">
                  {activeAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 transition-colors"
              title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>

            <button
              onClick={() => {
                if (showResetConfirm) {
                  resetAccount();
                  setShowResetConfirm(false);
                } else {
                  setShowResetConfirm(true);
                  setTimeout(() => setShowResetConfirm(false), 4000);
                }
              }}
              className={`p-2 rounded-lg border transition-all ${
                showResetConfirm
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 text-xs px-2.5 font-semibold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
              title="Reset Portfolio Simulation"
            >
              {showResetConfirm ? 'Confirm Reset?' : <RotateCcw className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden flex items-center justify-around border-t border-zinc-800/80 bg-zinc-950 px-2 py-1.5 text-xs">
        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded ${
            activeTab === 'terminal' ? 'text-emerald-400 font-bold bg-zinc-900' : 'text-zinc-400'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Desk
        </button>
        <button
          onClick={() => setActiveTab('screener')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded ${
            activeTab === 'screener' ? 'text-emerald-400 font-bold bg-zinc-900' : 'text-zinc-400'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Screener
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded ${
            activeTab === 'portfolio' ? 'text-emerald-400 font-bold bg-zinc-900' : 'text-zinc-400'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('timeHorizon')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded ${
            activeTab === 'timeHorizon' ? 'text-emerald-400 font-bold bg-zinc-900' : 'text-zinc-400'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Scanner
        </button>
        <button
          onClick={() => setActiveTab('marketPulse')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded ${
            activeTab === 'marketPulse' ? 'text-emerald-400 font-bold bg-zinc-900' : 'text-zinc-400'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          Pulse
        </button>
      </div>
    </header>
  );
};
