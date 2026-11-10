import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  Shield,
  HelpCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';
import { sendChatMessage } from '../services/aiService';

interface ChatMsg {
  sender: 'user' | 'copilot';
  text: string;
  time: string;
}

export const ApexCopilot: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    selectedStock,
    totalPortfolioValue,
    cashBalance,
    positions,
  } = useTrading();

  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: 'copilot',
      text: `Hello! I am **Apex Copilot**, your institutional AI trading and market strategist.
I have real-time visibility into **${selectedStock.symbol}** ($${selectedStock.price.toFixed(2)}) and your active portfolio ($${totalPortfolioValue.toLocaleString()}).

Ask me anything about market trends, technical breakout patterns, Fed rate sentiment, or order execution strategies.`,
      time: 'Just now',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isCopilotOpen) return null;

  const quickPrompts = [
    `Analyze ${selectedStock.symbol} entry & stop-loss`,
    'Is today market sentiment bullish or bearish?',
    'How should I hedge my tech stock risk?',
    'Explain the current 1-minute volume spike',
  ];

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMsg = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'model', content: m.text })).concat({
          role: 'user',
          content: textToSend,
        }),
        selectedStock,
        {
          totalPortfolioValue,
          cashBalance,
          positionsCount: positions.length,
        }
      );

      const copilotMsg: ChatMsg = {
        sender: 'copilot',
        text: response,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-zinc-950 border-l border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/90 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              Apex Copilot <span className="text-[10px] text-emerald-400 font-mono">LIVE AI</span>
            </h3>
            <p className="text-[10px] text-zinc-400">Institutional Market Strategist</p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Context Pill */}
      <div className="bg-zinc-900/50 border-b border-zinc-800/80 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
        <span>Active Asset: <strong className="text-white">{selectedStock.symbol} (${selectedStock.price.toFixed(2)})</strong></span>
        <span className="text-emerald-400 font-bold">{selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%</span>
      </div>

      {/* Messages Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg, i) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={i}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10 text-[9px] text-zinc-400 font-mono">
                  <span>{msg.time}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopy(msg.text, i)}
                      className="hover:text-white flex items-center gap-1"
                    >
                      {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-none p-3 text-xs text-zinc-400 flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span>Evaluating order book dynamics & catalysts...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 flex flex-wrap gap-1.5">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="border-t border-zinc-800 bg-zinc-900/90 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market trends, support/resistance..."
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
