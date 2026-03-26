export type MarketType = 'crypto' | 'stocks' | 'forex' | 'indian';

export type Timeframe = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1D' | '1W';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume: number;
  marketType: MarketType;
  image?: string;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface DrawingTool {
  id: string;
  name: string;
  icon: string;
  type: 'trendLine' | 'horizontalLine' | 'verticalLine' | 'rectangle' | 'brush' | 'text' | 'fibonacci';
}

export interface Indicator {
  id: string;
  name: string;
  shortName: string;
  active: boolean;
  params?: Record<string, number>;
}

export interface WatchlistItem extends Asset {
  addedAt: number;
}

export interface ChartPoint {
  x: number;
  y: number;
  time: number;
  price: number;
}

export interface Drawing {
  id: string;
  type: DrawingTool['type'];
  points: ChartPoint[];
  color: string;
  text?: string;
}
