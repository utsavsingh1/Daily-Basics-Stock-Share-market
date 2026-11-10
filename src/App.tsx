/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { Header } from './components/Header';
import { FinancialChart } from './components/FinancialChart';
import { OrderBook } from './components/OrderBook';
import { TradeExecutionPanel } from './components/TradeExecutionPanel';
import { StockScreener } from './components/StockScreener';
import { PortfolioView } from './components/PortfolioView';
import { TimeHorizonScanner } from './components/TimeHorizonScanner';
import { MarketPulseView } from './components/MarketPulseView';
import { StockAnalysisModal } from './components/StockAnalysisModal';
import { ApexCopilot } from './components/ApexCopilot';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { Bell, X, ArrowRight, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    activeAlertTriggered,
    dismissActiveAlert,
    setSelectedStock,
    stocks,
    setActiveTab,
    requestStockAnalysis,
  } = useTrading();

  const [alertsModalOpen, setAlertsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Institutional Header */}
      <Header onOpenAlerts={() => setAlertsModalOpen(true)} />

      {/* Real-time Alert Trigger Notification Banner */}
      {activeAlertTriggered && (
        <div className="bg-amber-500/20 border-b border-amber-500/40 px-4 py-2 flex items-center justify-between text-xs text-amber-200 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-full bg-amber-500 text-zinc-950">
              <Bell className="w-3.5 h-3.5" />
            </span>
            <span>
              <strong>PRICE ALERT HIT:</strong> {activeAlertTriggered.symbol} crossed your target of{' '}
              <strong>${activeAlertTriggered.targetPrice.toFixed(2)}</strong>! ({activeAlertTriggered.notes || 'Target crossed'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const s = stocks.find((stk) => stk.symbol === activeAlertTriggered.symbol);
                if (s) {
                  setSelectedStock(s);
                  setActiveTab('terminal');
                }
                dismissActiveAlert();
              }}
              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
            >
              <span>View & Trade</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={dismissActiveAlert}
              className="p-1 text-amber-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 max-w-[1680px] w-full mx-auto">
        {activeTab === 'terminal' && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
            {/* Left 8 cols: Interactive Financial Chart & Timeframes */}
            <div className="xl:col-span-8 flex flex-col space-y-4">
              <FinancialChart />

              {/* Quick Intraday Scanner Bar */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-400 font-mono">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span>Day/Minute/Second Performance Stream Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('timeHorizon')}
                    className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium transition-colors"
                  >
                    View Horizon Breakdown
                  </button>
                  <button
                    onClick={() => setActiveTab('screener')}
                    className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-medium transition-colors"
                  >
                    Market Screener
                  </button>
                </div>
              </div>
            </div>

            {/* Right 4 cols: Order Book L2 + Trade Ticket */}
            <div className="xl:col-span-4 flex flex-col space-y-4">
              <TradeExecutionPanel />
              <OrderBook />
            </div>
          </div>
        )}

        {activeTab === 'screener' && <StockScreener />}

        {activeTab === 'portfolio' && <PortfolioView />}

        {activeTab === 'timeHorizon' && <TimeHorizonScanner />}

        {activeTab === 'marketPulse' && <MarketPulseView />}
      </main>

      {/* Modals & Slide-out Drawers */}
      <StockAnalysisModal />
      <ApexCopilot />
      <PriceAlertsModal
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <MainLayout />
    </TradingProvider>
  );
}
