import type { Asset, DrawingTool, Indicator, Timeframe } from '@/types/trading';

export const TIMEFRAMES: { value: Timeframe; label: string }[] = [
  { value: '1m', label: '1m' },
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '30m', label: '30m' },
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
];

export const DRAWING_TOOLS: DrawingTool[] = [
  { id: 'trendLine', name: 'Trend Line', icon: 'TrendingUp', type: 'trendLine' },
  { id: 'horizontalLine', name: 'Horizontal Line', icon: 'Minus', type: 'horizontalLine' },
  { id: 'verticalLine', name: 'Vertical Line', icon: 'ArrowDownUp', type: 'verticalLine' },
  { id: 'rectangle', name: 'Rectangle', icon: 'Square', type: 'rectangle' },
  { id: 'brush', name: 'Brush', icon: 'Pencil', type: 'brush' },
  { id: 'text', name: 'Text', icon: 'Type', type: 'text' },
  { id: 'fibonacci', name: 'Fibonacci', icon: 'Layers', type: 'fibonacci' },
];

export const INDICATORS: Indicator[] = [
  { id: 'sma', name: 'Simple Moving Average', shortName: 'SMA', active: false, params: { period: 20 } },
  { id: 'ema', name: 'Exponential Moving Average', shortName: 'EMA', active: false, params: { period: 20 } },
  { id: 'rsi', name: 'Relative Strength Index', shortName: 'RSI', active: false, params: { period: 14 } },
  { id: 'macd', name: 'MACD', shortName: 'MACD', active: false, params: { fast: 12, slow: 26, signal: 9 } },
  { id: 'bollinger', name: 'Bollinger Bands', shortName: 'BB', active: false, params: { period: 20, stdDev: 2 } },
  { id: 'vwap', name: 'Volume Weighted Average Price', shortName: 'VWAP', active: false },
];

export const DEFAULT_CRYPTO_ASSETS: Asset[] = [
  { id: 'bitcoin', symbol: 'BTC/USD', name: 'Bitcoin', price: 0, change24h: 0, volume: 0, marketType: 'crypto' },
  { id: 'ethereum', symbol: 'ETH/USD', name: 'Ethereum', price: 0, change24h: 0, volume: 0, marketType: 'crypto' },
  { id: 'solana', symbol: 'SOL/USD', name: 'Solana', price: 0, change24h: 0, volume: 0, marketType: 'crypto' },
];

export const DEFAULT_STOCK_ASSETS: Asset[] = [
  { id: 'AAPL', symbol: 'AAPL', name: 'Apple Inc.', price: 0, change24h: 0, volume: 0, marketType: 'stocks' },
  { id: 'TSLA', symbol: 'TSLA', name: 'Tesla Inc.', price: 0, change24h: 0, volume: 0, marketType: 'stocks' },
  { id: 'NVDA', symbol: 'NVDA', name: 'NVIDIA Corp.', price: 0, change24h: 0, volume: 0, marketType: 'stocks' },
];

export const DEFAULT_FOREX_ASSETS: Asset[] = [
  { id: 'EURUSD', symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 0, change24h: 0, volume: 0, marketType: 'forex' },
  { id: 'GBPUSD', symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 0, change24h: 0, volume: 0, marketType: 'forex' },
  { id: 'USDJPY', symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 0, change24h: 0, volume: 0, marketType: 'forex' },
  { id: 'USDINR', symbol: 'USD/INR', name: 'US Dollar / Indian Rupee', price: 0, change24h: 0, volume: 0, marketType: 'forex' },
];

export const DEFAULT_INDIAN_ASSETS: Asset[] = [
  { id: 'RELIANCE', symbol: 'RELIANCE.NSE', name: 'Reliance Industries', price: 0, change24h: 0, volume: 0, marketType: 'indian' },
  { id: 'TCS', symbol: 'TCS.NSE', name: 'Tata Consultancy Services', price: 0, change24h: 0, volume: 0, marketType: 'indian' },
  { id: 'HDFCBANK', symbol: 'HDFCBANK.NSE', name: 'HDFC Bank', price: 0, change24h: 0, volume: 0, marketType: 'indian' },
  { id: 'INFY', symbol: 'INFY.NSE', name: 'Infosys', price: 0, change24h: 0, volume: 0, marketType: 'indian' },
  { id: 'SBIN', symbol: 'SBIN.NSE', name: 'State Bank of India', price: 0, change24h: 0, volume: 0, marketType: 'indian' },
  { id: 'ITC', symbol: 'ITC.NSE', name: 'ITC Ltd', price: 0, change24h: 0, volume: 0, marketType: 'indian' },
  { id: 'NIFTY50', symbol: 'NIFTY', name: 'NIFTY 50 Index', price: 0, change24h: 0, volume: 0, marketType: 'indian' },
  { id: 'BANKNIFTY', symbol: 'BANKNIFTY', name: 'NIFTY Bank Index', price: 0, change24h: 0, volume: 0, marketType: 'indian' },
  { id: 'SENSEX', symbol: 'SENSEX', name: 'BSE Sensex Index', price: 0, change24h: 0, volume: 0, marketType: 'indian' },
];

export const ALL_DEFAULT_ASSETS: Asset[] = [
  ...DEFAULT_CRYPTO_ASSETS,
  ...DEFAULT_STOCK_ASSETS,
  ...DEFAULT_FOREX_ASSETS,
  ...DEFAULT_INDIAN_ASSETS,
];

export const CHART_COLORS = {
  upColor: '#10b981',
  downColor: '#ef4444',
  borderUpColor: '#10b981',
  borderDownColor: '#ef4444',
  wickUpColor: '#10b981',
  wickDownColor: '#ef4444',
  volumeUp: 'rgba(16, 185, 129, 0.5)',
  volumeDown: 'rgba(239, 68, 68, 0.5)',
  gridColor: 'rgba(30, 36, 51, 0.5)',
  textColor: '#8b92a5',
  crosshairColor: '#00d4ff',
};
