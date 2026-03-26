'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { createChart, IChartApi, ISeriesApi, CandlestickData, LineData, HistogramData, Time } from 'lightweight-charts';
import { useTradingStore } from '@/lib/store';
import { fetchCandleData, subscribeToPrice } from '@/lib/api';
import { CHART_COLORS } from '@/lib/constants';
import {
  calculateSMA,
  calculateEMA,
  calculateRSI,
  calculateMACD,
  calculateBollingerBands,
  calculateVWAP,
} from '@/lib/indicators';
import { DrawingCanvas } from '@/components/charts/DrawingCanvas';
import type { CandleData } from '@/types/trading';

export function TradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const indicatorSeriesRef = useRef<Map<string, ISeriesApi<'Line'>>>(new Map());
  
  const { selectedAsset, timeframe, indicators } = useTradingStore();
  const [isLoading, setIsLoading] = useState(true);
  const [candleData, setCandleData] = useState<CandleData[]>([]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: CHART_COLORS.textColor,
      },
      grid: {
        vertLines: { color: CHART_COLORS.gridColor },
        horzLines: { color: CHART_COLORS.gridColor },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: CHART_COLORS.crosshairColor,
          width: 1,
          style: 2,
          labelBackgroundColor: CHART_COLORS.crosshairColor,
        },
        horzLine: {
          color: CHART_COLORS.crosshairColor,
          width: 1,
          style: 2,
          labelBackgroundColor: CHART_COLORS.crosshairColor,
        },
      },
      rightPriceScale: {
        borderColor: CHART_COLORS.gridColor,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      timeScale: {
        borderColor: CHART_COLORS.gridColor,
        timeVisible: true,
        secondsVisible: false,
      },
      handleScale: {
        axisPressedMouseMove: true,
      },
      handleScroll: {
        vertTouchDrag: true,
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: CHART_COLORS.upColor,
      downColor: CHART_COLORS.downColor,
      borderUpColor: CHART_COLORS.borderUpColor,
      borderDownColor: CHART_COLORS.borderDownColor,
      wickUpColor: CHART_COLORS.wickUpColor,
      wickDownColor: CHART_COLORS.wickDownColor,
    });

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.85,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Fetch and update data when asset or timeframe changes
  useEffect(() => {
    if (!selectedAsset || !candlestickSeriesRef.current || !volumeSeriesRef.current) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCandleData(selectedAsset, timeframe);
        setCandleData(data);

        // Update candlestick series
        const candleSeriesData: CandlestickData<Time>[] = data.map((d) => ({
          time: d.time as Time,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));
        candlestickSeriesRef.current?.setData(candleSeriesData);

        // Update volume series
        const volumeData: HistogramData<Time>[] = data.map((d) => ({
          time: d.time as Time,
          value: d.volume || 0,
          color: d.close >= d.open ? CHART_COLORS.volumeUp : CHART_COLORS.volumeDown,
        }));
        volumeSeriesRef.current?.setData(volumeData);

        // Fit content
        chartRef.current?.timeScale().fitContent();
      } catch (error) {
        console.error('Failed to load chart data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedAsset, timeframe]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!selectedAsset || !candlestickSeriesRef.current || candleData.length === 0) return;

    const unsubscribe = subscribeToPrice(selectedAsset, (price) => {
      const lastCandle = candleData[candleData.length - 1];
      if (!lastCandle) return;

      const updatedCandle: CandlestickData<Time> = {
        time: lastCandle.time as Time,
        open: lastCandle.open,
        high: Math.max(lastCandle.high, price),
        low: Math.min(lastCandle.low, price),
        close: price,
      };

      candlestickSeriesRef.current?.update(updatedCandle);
    });

    return unsubscribe;
  }, [selectedAsset, candleData]);

  // Update indicators
  const updateIndicators = useCallback(() => {
    if (!chartRef.current || candleData.length === 0) return;

    // Clear old indicator series
    indicatorSeriesRef.current.forEach((series) => {
      chartRef.current?.removeSeries(series);
    });
    indicatorSeriesRef.current.clear();

    const activeIndicators = indicators.filter((i) => i.active);

    activeIndicators.forEach((indicator) => {
      let lineData: LineData<Time>[] = [];
      let color = '#00d4ff';

      switch (indicator.id) {
        case 'sma': {
          const smaData = calculateSMA(candleData, indicator.params?.period || 20);
          lineData = smaData.map((d) => ({ time: d.time as Time, value: d.value }));
          color = '#00d4ff';
          break;
        }
        case 'ema': {
          const emaData = calculateEMA(candleData, indicator.params?.period || 20);
          lineData = emaData.map((d) => ({ time: d.time as Time, value: d.value }));
          color = '#7c3aed';
          break;
        }
        case 'bollinger': {
          const bbData = calculateBollingerBands(
            candleData,
            indicator.params?.period || 20,
            indicator.params?.stdDev || 2
          );
          
          // Add upper band
          const upperSeries = chartRef.current!.addLineSeries({
            color: 'rgba(0, 212, 255, 0.5)',
            lineWidth: 1,
          });
          upperSeries.setData(bbData.map((d) => ({ time: d.time as Time, value: d.upper })));
          indicatorSeriesRef.current.set('bb_upper', upperSeries);
          
          // Add lower band
          const lowerSeries = chartRef.current!.addLineSeries({
            color: 'rgba(0, 212, 255, 0.5)',
            lineWidth: 1,
          });
          lowerSeries.setData(bbData.map((d) => ({ time: d.time as Time, value: d.lower })));
          indicatorSeriesRef.current.set('bb_lower', lowerSeries);
          
          // Middle band
          lineData = bbData.map((d) => ({ time: d.time as Time, value: d.middle }));
          color = 'rgba(0, 212, 255, 0.8)';
          break;
        }
        case 'vwap': {
          const vwapData = calculateVWAP(candleData);
          lineData = vwapData.map((d) => ({ time: d.time as Time, value: d.value }));
          color = '#f59e0b';
          break;
        }
        case 'rsi': {
          // RSI is typically shown in a separate pane, but we'll overlay it for simplicity
          const rsiData = calculateRSI(candleData, indicator.params?.period || 14);
          // Note: RSI should ideally be in a separate pane
          // For now, skip to avoid scaling issues
          return;
        }
        case 'macd': {
          // MACD is typically shown in a separate pane
          const macdData = calculateMACD(
            candleData,
            indicator.params?.fast || 12,
            indicator.params?.slow || 26,
            indicator.params?.signal || 9
          );
          // For now, skip to avoid scaling issues
          return;
        }
      }

      if (lineData.length > 0) {
        const series = chartRef.current!.addLineSeries({
          color,
          lineWidth: 2,
        });
        series.setData(lineData);
        indicatorSeriesRef.current.set(indicator.id, series);
      }
    });
  }, [candleData, indicators]);

  useEffect(() => {
    updateIndicators();
  }, [updateIndicators]);

  return (
    <div className="relative flex-1 chart-container">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--neon-blue)] border-t-transparent" />
            <span className="text-sm text-muted-foreground">Loading chart...</span>
          </div>
        </motion.div>
      )}

      {!selectedAsset && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">No asset selected</p>
            <p className="text-sm">Search or select an asset from the watchlist</p>
          </div>
        </div>
      )}

      <div ref={chartContainerRef} className="h-full w-full" />
      
      {/* Drawing Canvas Overlay */}
      <DrawingCanvas />

      {/* Price Info Overlay */}
      {selectedAsset && !isLoading && candleData.length > 0 && (
        <div className="absolute left-4 top-4 z-30 pointer-events-none">
          <div className="rounded-lg bg-card/80 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{selectedAsset.symbol}</span>
              <span className="rounded bg-secondary px-1.5 py-0.5 text-xs">
                {timeframe}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              O: {candleData[candleData.length - 1]?.open.toFixed(2)} 
              H: {candleData[candleData.length - 1]?.high.toFixed(2)} 
              L: {candleData[candleData.length - 1]?.low.toFixed(2)} 
              C: {candleData[candleData.length - 1]?.close.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
