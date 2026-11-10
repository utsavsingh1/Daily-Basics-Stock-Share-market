import React, { useRef, useState, useMemo } from 'react';
import {
  Maximize2,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Sliders,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';
import { Candle, Timeframe } from '../types/market';
import { useTrading } from '../context/TradingContext';

export const FinancialChart: React.FC = () => {
  const {
    selectedStock,
    timeframe,
    setTimeframe,
    candles,
    technicals,
    positions,
    alerts,
    requestStockAnalysis,
  } = useTrading();

  const [chartType, setChartType] = useState<'candle' | 'area'>('candle');
  const [showSMA20, setShowSMA20] = useState<boolean>(true);
  const [showSMA50, setShowSMA50] = useState<boolean>(true);
  const [showEMA12, setShowEMA12] = useState<boolean>(false);
  const [showBollinger, setShowBollinger] = useState<boolean>(false);
  const [showVWAP, setShowVWAP] = useState<boolean>(true);
  const [activeSubChart, setActiveSubChart] = useState<'volume' | 'rsi' | 'macd'>('volume');
  const [showIndicatorMenu, setShowIndicatorMenu] = useState<boolean>(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Check if user holds this stock
  const currentPosition = positions.find((p) => p.symbol === selectedStock.symbol);
  const activeAlerts = alerts.filter((a) => a.symbol === selectedStock.symbol && !a.triggered);

  // Timeframe buttons
  const timeframes: { label: string; value: Timeframe; badge?: string }[] = [
    { label: '1s', value: '1s', badge: 'LIVE' },
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '1h', value: '1h' },
    { label: '1D', value: '1D' },
    { label: '1W', value: '1W' },
    { label: '1M', value: '1M' },
    { label: '1Y', value: '1Y' },
  ];

  // Calculate coordinates and scales for SVG rendering
  const chartHeight = 360;
  const subChartHeight = 90;
  const chartWidth = 800; // viewbox units

  const { minPrice, maxPrice, maxVolume, priceRange } = useMemo(() => {
    if (candles.length === 0) {
      return { minPrice: 100, maxPrice: 110, maxVolume: 1000, priceRange: 10 };
    }
    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    // Add 4% padding top and bottom
    const range = max - min || 1;
    const paddedMin = min - range * 0.04;
    const paddedMax = max + range * 0.04;

    return {
      minPrice: paddedMin,
      maxPrice: paddedMax,
      maxVolume: maxVol || 1,
      priceRange: paddedMax - paddedMin || 1,
    };
  }, [candles]);

  const getY = (val: number) => {
    return chartHeight - ((val - minPrice) / priceRange) * chartHeight;
  };

  const candleCount = candles.length;
  const candleSpacing = chartWidth / Math.max(candleCount, 1);
  const candleBodyWidth = Math.max(2, Math.min(8, candleSpacing * 0.7));

  // Compute points for line / area chart
  const areaPoints = useMemo(() => {
    if (candles.length === 0) return '';
    return candles
      .map((c, i) => {
        const x = i * candleSpacing + candleSpacing / 2;
        const y = getY(c.close);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [candles, candleSpacing, minPrice, priceRange]);

  const areaPolygon = useMemo(() => {
    if (!areaPoints || candles.length === 0) return '';
    const firstX = candleSpacing / 2;
    const lastX = (candles.length - 1) * candleSpacing + candleSpacing / 2;
    return `${firstX},${chartHeight} ${areaPoints} ${lastX},${chartHeight}`;
  }, [areaPoints, candles.length, candleSpacing]);

  // Compute SMA lines
  const sma20Points = useMemo(() => {
    if (!showSMA20 || candles.length < 20) return '';
    const pts: string[] = [];
    for (let i = 19; i < candles.length; i++) {
      const slice = candles.slice(i - 19, i + 1);
      const avg = slice.reduce((a, b) => a + b.close, 0) / 20;
      const x = i * candleSpacing + candleSpacing / 2;
      const y = getY(avg);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [showSMA20, candles, candleSpacing, minPrice, priceRange]);

  const sma50Points = useMemo(() => {
    if (!showSMA50 || candles.length < 50) return '';
    const pts: string[] = [];
    for (let i = 49; i < candles.length; i++) {
      const slice = candles.slice(i - 49, i + 1);
      const avg = slice.reduce((a, b) => a + b.close, 0) / 50;
      const x = i * candleSpacing + candleSpacing / 2;
      const y = getY(avg);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [showSMA50, candles, candleSpacing, minPrice, priceRange]);

  const vwapPoints = useMemo(() => {
    if (!showVWAP || candles.length === 0) return '';
    return candles
      .map((c, i) => {
        if (!c.vwap) return null;
        const x = i * candleSpacing + candleSpacing / 2;
        const y = getY(c.vwap);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .filter(Boolean)
      .join(' ');
  }, [showVWAP, candles, candleSpacing, minPrice, priceRange]);

  // Hovered or latest candle for display
  const activeCandleIndex = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < candles.length
    ? hoverIndex
    : candles.length - 1;
  const activeCandle = candles[activeCandleIndex];

  // Price lines (Horizontal grid)
  const priceGridLines = useMemo(() => {
    const lines: number[] = [];
    const step = priceRange / 5;
    for (let i = 1; i <= 4; i++) {
      lines.push(minPrice + i * step);
    }
    return lines;
  }, [minPrice, priceRange]);

  const isUpSession = selectedStock.change >= 0;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-2xl">
      {/* Chart Top Header & HUD */}
      <div className="border-b border-zinc-800/80 px-4 py-3 bg-zinc-900/60 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Ticker details & live price */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight">{selectedStock.symbol}</span>
              <span className="text-xs text-zinc-400 font-medium hidden sm:inline">{selectedStock.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                {selectedStock.sector}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-extrabold font-mono text-white">
                ${selectedStock.price.toFixed(2)}
              </span>
              <span
                className={`flex items-center text-xs font-mono font-bold ${
                  isUpSession ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isUpSession ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
                {isUpSession ? '+' : ''}
                {selectedStock.change.toFixed(2)} ({isUpSession ? '+' : ''}
                {selectedStock.changePercent.toFixed(2)}%)
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-[11px] font-mono text-zinc-400">
                Vol: {(selectedStock.volume / 1000000).toFixed(2)}M
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Candle Inspector HUD */}
        {activeCandle && (
          <div className="hidden xl:flex items-center gap-4 text-xs font-mono bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800/80">
            <span className="text-zinc-400 text-[11px]">
              {new Date(activeCandle.time).toLocaleTimeString('en-US', { hour12: false })}
            </span>
            <span>
              <span className="text-zinc-500 mr-1">O:</span>
              <span className="text-zinc-200">${activeCandle.open.toFixed(2)}</span>
            </span>
            <span>
              <span className="text-zinc-500 mr-1">H:</span>
              <span className="text-emerald-400">${activeCandle.high.toFixed(2)}</span>
            </span>
            <span>
              <span className="text-zinc-500 mr-1">L:</span>
              <span className="text-rose-400">${activeCandle.low.toFixed(2)}</span>
            </span>
            <span>
              <span className="text-zinc-500 mr-1">C:</span>
              <span className="text-zinc-100 font-bold">${activeCandle.close.toFixed(2)}</span>
            </span>
            <span>
              <span className="text-zinc-500 mr-1">RSI:</span>
              <span
                className={`font-semibold ${
                  (technicals.rsi ?? 50) > 70
                    ? 'text-rose-400'
                    : (technicals.rsi ?? 50) < 30
                    ? 'text-emerald-400'
                    : 'text-zinc-300'
                }`}
              >
                {technicals.rsi ?? '52.4'}
              </span>
            </span>
          </div>
        )}

        {/* Right: Timeframe, Chart type, AI Trigger, Indicators */}
        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`relative px-2.5 py-1 text-xs font-mono font-medium rounded transition-all ${
                  timeframe === tf.value
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {tf.label}
                {tf.badge && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Chart Style Toggle */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => setChartType('candle')}
              className={`px-2 py-1 rounded transition-colors ${
                chartType === 'candle' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Candlestick Chart"
            >
              Candle
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 rounded transition-colors ${
                chartType === 'area' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Area Line Chart"
            >
              Line
            </button>
          </div>

          {/* Indicator toggles dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowIndicatorMenu(!showIndicatorMenu)}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs ${
                showIndicatorMenu
                  ? 'bg-zinc-800 border-zinc-700 text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
              title="Toggle Technical Indicators"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Studies</span>
            </button>

            {showIndicatorMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2.5 z-50 text-xs space-y-1.5">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider px-2 py-1">
                  Overlays & Signals
                </div>
                <button
                  onClick={() => setShowSMA20(!showSMA20)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-zinc-800 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    <span className="text-zinc-200">SMA 20 ({technicals.sma20 ?? 'N/A'})</span>
                  </span>
                  {showSMA20 ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                </button>

                <button
                  onClick={() => setShowSMA50(!showSMA50)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-zinc-800 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="text-zinc-200">SMA 50 ({technicals.sma50 ?? 'N/A'})</span>
                  </span>
                  {showSMA50 ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                </button>

                <button
                  onClick={() => setShowEMA12(!showEMA12)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-zinc-800 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                    <span className="text-zinc-200">EMA 12 ({technicals.ema12 ?? 'N/A'})</span>
                  </span>
                  {showEMA12 ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                </button>

                <button
                  onClick={() => setShowVWAP(!showVWAP)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-zinc-800 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
                    <span className="text-zinc-200">VWAP (${technicals.vwap ?? selectedStock.price})</span>
                  </span>
                  {showVWAP ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                </button>

                <button
                  onClick={() => setShowBollinger(!showBollinger)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-zinc-800 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-zinc-200">Bollinger Bands (20, 2)</span>
                  </span>
                  {showBollinger ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-zinc-500" />}
                </button>
              </div>
            )}
          </div>

          {/* AI Analysis Quick Trigger */}
          <button
            onClick={() => requestStockAnalysis(selectedStock)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Analyst</span>
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Chart Canvas */}
      <div
        ref={containerRef}
        onMouseLeave={() => setHoverIndex(null)}
        onMouseMove={(e) => {
          if (!containerRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
          const idx = Math.floor(ratio * candles.length);
          setHoverIndex(Math.min(candles.length - 1, Math.max(0, idx)));
        }}
        className="relative w-full h-[360px] bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/60 cursor-crosshair select-none"
      >
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#10B981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="candleUpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="candleDownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {priceGridLines.map((price, i) => {
            const y = getY(price);
            return (
              <g key={`grid-${i}`}>
                <line
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#27272a"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={chartWidth - 8}
                  y={y - 4}
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  ${price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Area Chart Mode */}
          {chartType === 'area' && (
            <>
              <polygon points={areaPolygon} fill="url(#areaGradient)" />
              <polyline
                points={areaPoints}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Candlestick Chart Mode */}
          {chartType === 'candle' &&
            candles.map((candle, i) => {
              const x = i * candleSpacing + candleSpacing / 2;
              const isGreen = candle.close >= candle.open;
              const yHigh = getY(candle.high);
              const yLow = getY(candle.low);
              const yOpen = getY(candle.open);
              const yClose = getY(candle.close);
              const candleTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(2, Math.abs(yClose - yOpen));

              return (
                <g key={`candle-${candle.time}-${i}`}>
                  {/* Upper and Lower Wick */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={isGreen ? '#34D399' : '#F87171'}
                    strokeWidth="1.2"
                  />
                  {/* Real Body */}
                  <rect
                    x={x - candleBodyWidth / 2}
                    y={candleTop}
                    width={candleBodyWidth}
                    height={candleHeight}
                    rx="1"
                    fill={isGreen ? 'url(#candleUpGradient)' : 'url(#candleDownGradient)'}
                    stroke={isGreen ? '#059669' : '#B91C1C'}
                    strokeWidth="0.8"
                  />
                </g>
              );
            })}

          {/* Technical Indicator Lines */}
          {showSMA20 && sma20Points && (
            <polyline
              points={sma20Points}
              fill="none"
              stroke="#22D3EE"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          )}

          {showSMA50 && sma50Points && (
            <polyline
              points={sma50Points}
              fill="none"
              stroke="#FBBF24"
              strokeWidth="1.6"
            />
          )}

          {showVWAP && vwapPoints && (
            <polyline
              points={vwapPoints}
              fill="none"
              stroke="#FB923C"
              strokeWidth="1.4"
              strokeDasharray="4 2"
            />
          )}

          {/* Current Position Marker: Blue Dashed Average Cost Line */}
          {currentPosition && (
            <g>
              <line
                x1="0"
                y1={getY(currentPosition.avgPrice)}
                x2={chartWidth}
                y2={getY(currentPosition.avgPrice)}
                stroke="#38BDF8"
                strokeWidth="1.5"
                strokeDasharray="6 3"
              />
              <rect
                x="8"
                y={getY(currentPosition.avgPrice) - 10}
                width="140"
                height="20"
                rx="4"
                fill="#0369A1"
              />
              <text
                x="14"
                y={getY(currentPosition.avgPrice) + 4}
                fill="#FFFFFF"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                Avg Cost: ${currentPosition.avgPrice.toFixed(2)} ({currentPosition.shares}sh)
              </text>
            </g>
          )}

          {/* Active Price Alert Lines */}
          {activeAlerts.map((alert) => (
            <g key={alert.id}>
              <line
                x1="0"
                y1={getY(alert.targetPrice)}
                x2={chartWidth}
                y2={getY(alert.targetPrice)}
                stroke="#FACC15"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              <rect
                x={chartWidth - 110}
                y={getY(alert.targetPrice) - 9}
                width="100"
                height="18"
                rx="3"
                fill="#854D0E"
              />
              <text
                x={chartWidth - 60}
                y={getY(alert.targetPrice) + 4}
                fill="#FEF08A"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
                fontWeight="bold"
              >
                Alert: ${alert.targetPrice.toFixed(2)}
              </text>
            </g>
          ))}

          {/* Crosshair on Hover */}
          {hoverIndex !== null && hoverIndex >= 0 && hoverIndex < candles.length && (
            <g>
              {/* Vertical line */}
              <line
                x1={hoverIndex * candleSpacing + candleSpacing / 2}
                y1="0"
                x2={hoverIndex * candleSpacing + candleSpacing / 2}
                y2={chartHeight}
                stroke="#94A3B8"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Horizontal line */}
              <line
                x1="0"
                y1={getY(candles[hoverIndex].close)}
                x2={chartWidth}
                y2={getY(candles[hoverIndex].close)}
                stroke="#94A3B8"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Price Tag on Axis */}
              <rect
                x={chartWidth - 60}
                y={getY(candles[hoverIndex].close) - 10}
                width="56"
                height="20"
                rx="3"
                fill="#3F3F46"
              />
              <text
                x={chartWidth - 32}
                y={getY(candles[hoverIndex].close) + 4}
                fill="#FFFFFF"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                ${candles[hoverIndex].close.toFixed(2)}
              </text>
            </g>
          )}

          {/* Live Price Tag Pulse */}
          <g>
            <line
              x1="0"
              y1={getY(selectedStock.price)}
              x2={chartWidth}
              y2={getY(selectedStock.price)}
              stroke={isUpSession ? '#10B981' : '#EF4444'}
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <rect
              x={chartWidth - 64}
              y={getY(selectedStock.price) - 11}
              width="60"
              height="22"
              rx="4"
              fill={isUpSession ? '#059669' : '#DC2626'}
            />
            <text
              x={chartWidth - 34}
              y={getY(selectedStock.price) + 4}
              fill="#FFFFFF"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="bold"
              textAnchor="middle"
            >
              ${selectedStock.price.toFixed(2)}
            </text>
          </g>
        </svg>

        {/* Live Tick Stream Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800 text-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono text-zinc-300">
            TICK FREQ: <span className="text-emerald-400 font-bold">800ms</span>
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-[11px] font-mono text-zinc-400">
            SPREAD: <span className="text-zinc-200">${(selectedStock.price * 0.0001).toFixed(2)}</span>
          </span>
        </div>
      </div>

      {/* Sub-chart Selector (Volume / RSI / MACD) */}
      <div className="border-t border-zinc-800 bg-zinc-950/90 px-3 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubChart('volume')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeSubChart === 'volume'
                ? 'bg-zinc-800 text-emerald-400 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Volume Bars
          </button>
          <button
            onClick={() => setActiveSubChart('rsi')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeSubChart === 'rsi'
                ? 'bg-zinc-800 text-cyan-400 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            RSI (14): {technicals.rsi ?? 52.4}
          </button>
          <button
            onClick={() => setActiveSubChart('macd')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors ${
              activeSubChart === 'macd'
                ? 'bg-zinc-800 text-purple-400 font-bold border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            MACD (12, 26, 9)
          </button>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
          {activeSubChart === 'rsi' && (
            <span>
              OB: <span className="text-rose-400 font-semibold">70</span> | OS: <span className="text-emerald-400 font-semibold">30</span>
            </span>
          )}
          {activeSubChart === 'macd' && technicals.macd && (
            <span>
              Hist: <span className={technicals.macd.histogram >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{technicals.macd.histogram}</span>
            </span>
          )}
        </div>
      </div>

      {/* Sub-chart SVG Canvas */}
      <div className="relative w-full h-[90px] bg-zinc-950 border-t border-zinc-800/40">
        <svg
          viewBox={`0 0 ${chartWidth} ${subChartHeight}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Subchart: Volume */}
          {activeSubChart === 'volume' &&
            candles.map((candle, i) => {
              const x = i * candleSpacing + candleSpacing / 2;
              const isGreen = candle.close >= candle.open;
              const volHeight = Math.max(2, (candle.volume / maxVolume) * (subChartHeight - 15));
              const y = subChartHeight - volHeight;

              return (
                <rect
                  key={`vol-${candle.time}-${i}`}
                  x={x - candleBodyWidth / 2}
                  y={y}
                  width={candleBodyWidth}
                  height={volHeight}
                  fill={isGreen ? '#10B981' : '#EF4444'}
                  opacity="0.65"
                />
              );
            })}

          {/* Subchart: RSI (14) */}
          {activeSubChart === 'rsi' && (
            <>
              {/* 70 Overbought line */}
              <line
                x1="0"
                y1={subChartHeight * 0.3}
                x2={chartWidth}
                y2={subChartHeight * 0.3}
                stroke="#EF4444"
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
              <text x="8" y={subChartHeight * 0.3 - 2} fill="#F87171" fontSize="9" fontFamily="monospace">
                70 Overbought
              </text>

              {/* 30 Oversold line */}
              <line
                x1="0"
                y1={subChartHeight * 0.7}
                x2={chartWidth}
                y2={subChartHeight * 0.7}
                stroke="#10B981"
                strokeDasharray="4 4"
                strokeWidth="0.8"
              />
              <text x="8" y={subChartHeight * 0.7 - 2} fill="#34D399" fontSize="9" fontFamily="monospace">
                30 Oversold
              </text>

              {/* RSI Oscillator Curve */}
              {candles.length > 1 && (
                <polyline
                  points={candles
                    .map((_, i) => {
                      const x = i * candleSpacing + candleSpacing / 2;
                      // Simulated smooth RSI oscillation around technicals.rsi
                      const offset = Math.sin((i / candles.length) * Math.PI * 4) * 15;
                      const rsiVal = Math.max(10, Math.min(90, (technicals.rsi ?? 52) + offset));
                      const y = subChartHeight - (rsiVal / 100) * subChartHeight;
                      return `${x.toFixed(1)},${y.toFixed(1)}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#22D3EE"
                  strokeWidth="1.8"
                />
              )}
            </>
          )}

          {/* Subchart: MACD */}
          {activeSubChart === 'macd' && (
            <>
              {/* Zero line */}
              <line
                x1="0"
                y1={subChartHeight / 2}
                x2={chartWidth}
                y2={subChartHeight / 2}
                stroke="#52525b"
                strokeWidth="1"
              />

              {/* Histogram bars */}
              {candles.map((_, i) => {
                const x = i * candleSpacing + candleSpacing / 2;
                const wave = Math.sin((i / candles.length) * Math.PI * 3);
                const barHeight = wave * 30;
                const isPos = barHeight >= 0;
                const y = isPos ? subChartHeight / 2 - barHeight : subChartHeight / 2;

                return (
                  <rect
                    key={`macd-bar-${i}`}
                    x={x - candleBodyWidth / 2}
                    y={y}
                    width={candleBodyWidth}
                    height={Math.max(1, Math.abs(barHeight))}
                    fill={isPos ? '#10B981' : '#EF4444'}
                    opacity="0.8"
                  />
                );
              })}
            </>
          )}
        </svg>
      </div>
    </div>
  );
};
