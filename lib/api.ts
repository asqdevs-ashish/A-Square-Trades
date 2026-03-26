import type { Asset, CandleData, MarketType, Timeframe } from '@/types/trading';
import { DEFAULT_CRYPTO_ASSETS, DEFAULT_STOCK_ASSETS, DEFAULT_FOREX_ASSETS, DEFAULT_INDIAN_ASSETS } from './constants';

interface TwelveDataSymbol {
  symbol: string;
  name: string;
  description?: string;
  exchange: string;
}

interface TwelveDataQuote {
  close: number;
  change_percentage: number;
  volume?: number;
}

const TWELVEDATA_BASE = 'https://api.twelvedata.com';
const TWELVEDATA_API_KEY = process.env.NEXT_PUBLIC_TWELVEDATA_API_KEY || process.env.TWELVEDATA_API_KEY;

// Helper to fetch quotes in batches to respect API limits (free tier ~8 symbols/call)
async function fetchQuotesBatch(symbols: string[], apikey: string): Promise<Record<string, TwelveDataQuote>> {
  const quotes: Record<string, TwelveDataQuote> = {};
  const BATCH_SIZE = 8;

  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    const batch = symbols.slice(i, i + BATCH_SIZE);
    const batchStr = batch.join(',');
    console.log(`[QUOTE-BATCH] ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(symbols.length / BATCH_SIZE)}: ${batchStr}`);
    
    try {
      const response = await fetch(
        `${TWELVEDATA_BASE}/quote?symbols=${batchStr}&apikey=${apikey}`,
        { next: { revalidate: 10 } }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
      const batchPrices = await response.json();
      
      batch.forEach((sym) => {
        const priceData = Array.isArray(batchPrices) ? 
          batchPrices.find((p: any) => (p as any).symbol === sym) || ({} as TwelveDataQuote) : 
          batchPrices[sym] || ({} as TwelveDataQuote);
        quotes[sym] = {
          close: priceData.close || 0,
          change_percentage: priceData.change_percentage || 0,
          volume: priceData.volume || 0,
        };
      });
    } catch (e) {
      console.warn(`[QUOTE-BATCH] Failed batch ${Math.floor(i / BATCH_SIZE) + 1}:`, e, batchStr);
      // Fallback zeros
      batch.forEach((sym) => {
        quotes[sym] = { close: 0, change_percentage: 0, volume: 0 };
      });
    }
  }
  return quotes;
}

// Generate mock data for demo purposes (since APIs require keys)
function generateMockCandles(basePrice: number, count: number = 100): CandleData[] {
  const candles: CandleData[] = [];
  let currentPrice = basePrice;
  const now = Date.now();
  const interval = 3600000; // 1 hour in ms
  
  for (let i = count - 1; i >= 0; i--) {
    const volatility = currentPrice * 0.02; // 2% volatility
    const open = currentPrice;
    const change = (Math.random() - 0.5) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.random() * 1000000 + 500000;
    
    candles.push({
      time: Math.floor((now - i * interval) / 1000),
      open,
      high,
      low,
      close,
      volume,
    });
    
    currentPrice = close;
  }
  
  return candles;
}

// Mock price data
const MOCK_PRICES: Record<string, { price: number; change24h: number }> = {
  bitcoin: { price: 67432.21, change24h: 2.34 },
  ethereum: { price: 3521.87, change24h: 1.89 },
  solana: { price: 142.56, change24h: 5.21 },
  AAPL: { price: 178.32, change24h: 0.87 },
  TSLA: { price: 245.67, change24h: -1.23 },
  EURUSD: { price: 1.0856, change24h: 0.12 },
  GBPUSD: { price: 1.2634, change24h: -0.08 },
  NVDA: { price: 875.32, change24h: 3.78 },
  RELIANCE: { price: 2850.45, change24h: 1.25 },
  TCS: { price: 4125.80, change24h: -0.45 },
};

export async function fetchCryptoPrice(symbol: string): Promise<{ price: number; change24h: number }> {
  if (!TWELVEDATA_API_KEY) {
    const mock = MOCK_PRICES[symbol.replace('/USD', '') as keyof typeof MOCK_PRICES] || { price: 100, change24h: 0 };
    return mock;
  }
  try {
    const response = await fetch(
      `${TWELVEDATA_BASE}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${TWELVEDATA_API_KEY}`,
      { next: { revalidate: 10 } }
    );
    if (!response.ok) throw new Error('TwelveData quote failed');
    const data = await response.json();
    return {
      price: data.close || 0,
      change24h: data.change_percentage || 0,
    };
  } catch {
    return MOCK_PRICES[symbol.replace('/USD', '') as keyof typeof MOCK_PRICES] || { price: 100, change24h: 0 };
  }
}

export async function fetchCryptoList(): Promise<Asset[]> {
  if (!TWELVEDATA_API_KEY) {
    return DEFAULT_CRYPTO_ASSETS;
  }
  try {
    const response = await fetch(
      `${TWELVEDATA_BASE}/symbols?type=crypto&per_page=20&page=1&apikey=${TWELVEDATA_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error('TwelveData crypto symbols fetch failed');
    const { data } = await response.json();
    const symbols = data.slice(0, 15).map((s: TwelveDataSymbol) => s.symbol);
    console.log(`[LIST] Quotes for crypto: ${symbols.join(',')}`);
    const prices = await fetchQuotesBatch(symbols, TWELVEDATA_API_KEY!);
    return data.slice(0, 15).map((s: TwelveDataSymbol) => {
      const priceData = prices[s.symbol] || ({} as TwelveDataQuote);
      return {
        id: s.symbol,
        symbol: s.symbol,
        name: s.name || s.description || 'Unknown',
        price: priceData.close || 0,
        change24h: priceData.change_percentage || 0,
        volume: priceData.volume || 0,
        marketType: 'crypto' as const,
      };
    });
  } catch (e) {
    console.warn('TwelveData crypto failed, fallback mock', e);
    return DEFAULT_CRYPTO_ASSETS;
  }
}

export async function fetchStockList(): Promise<Asset[]> {
  if (!TWELVEDATA_API_KEY) {
    return DEFAULT_STOCK_ASSETS;
  }
  try {
    const response = await fetch(
      `${TWELVEDATA_BASE}/symbols?type=Stock&exchange=NASDAQ&per_page=20&apikey=${TWELVEDATA_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error('TwelveData stock symbols fetch failed');
    const { data } = await response.json();
    const symbols = data.slice(0, 15).map((s: TwelveDataSymbol) => s.symbol);
    console.log(`[LIST] Quotes for stocks: ${symbols.join(',')}`);
    const prices = await fetchQuotesBatch(symbols, TWELVEDATA_API_KEY!);
    return data.slice(0, 15).map((s: TwelveDataSymbol) => {
      const priceData = prices[s.symbol] || ({} as TwelveDataQuote);
      return {
        id: s.symbol,
        symbol: s.symbol,
        name: s.name,
        price: priceData.close || 0,
        change24h: priceData.change_percentage || 0,
        volume: priceData.volume || 0,
        marketType: 'stocks' as const,
      };
    });
  } catch (e) {
    console.warn('TwelveData stocks failed, fallback', e);
    return DEFAULT_STOCK_ASSETS;
  }
}

export async function fetchForexList(): Promise<Asset[]> {
  if (!TWELVEDATA_API_KEY) {
    return DEFAULT_FOREX_ASSETS;
  }
  try {
    const response = await fetch(
      `${TWELVEDATA_BASE}/symbols?type=Forex&per_page=20&apikey=${TWELVEDATA_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error('TwelveData forex symbols fetch failed');
    const { data } = await response.json();
    const symbols = data.slice(0, 15).map((s: TwelveDataSymbol) => s.symbol);
    console.log(`[LIST] Quotes for forex: ${symbols.join(',')}`);
    const prices = await fetchQuotesBatch(symbols, TWELVEDATA_API_KEY!);
    return data.slice(0, 15).map((s: TwelveDataSymbol) => {
      const priceData = prices[s.symbol] || ({} as TwelveDataQuote);
      return {
        id: s.symbol,
        symbol: s.symbol,
        name: s.name || s.description || 'Unknown',
        price: priceData.close || 0,
        change24h: priceData.change_percentage || 0,
        volume: 0,
        marketType: 'forex' as const,
      };
    });
  } catch (e) {
    console.warn('TwelveData forex failed, fallback', e);
    return DEFAULT_FOREX_ASSETS;
  }
}

export async function fetchIndianList(): Promise<Asset[]> {
  if (!TWELVEDATA_API_KEY) {
    return DEFAULT_INDIAN_ASSETS;
  }
  try {
    const response = await fetch(
      `${TWELVEDATA_BASE}/symbols?exchange=NSE&country=India&type=Stock&per_page=20&apikey=${TWELVEDATA_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!response.ok) throw new Error('TwelveData indian symbols fetch failed');
    const { data } = await response.json();
    const symbols = data.slice(0, 15).map((s: TwelveDataSymbol) => s.symbol);
    console.log(`[LIST] Quotes for indian: ${symbols.join(',')}`);
    const prices = await fetchQuotesBatch(symbols, TWELVEDATA_API_KEY!);
    return data.slice(0, 15).map((s: TwelveDataSymbol) => {
      const priceData = prices[s.symbol] || ({} as TwelveDataQuote);
      return {
        id: s.symbol,
        symbol: s.symbol,
        name: s.name,
        price: priceData.close || 0,
        change24h: priceData.change_percentage || 0,
        volume: priceData.volume || 0,
        marketType: 'indian' as const,
      };
    });
  } catch (e) {
    console.warn('TwelveData indian failed, fallback', e);
    return DEFAULT_INDIAN_ASSETS;
  }
}

export async function fetchSymbolSearch(query: string, marketType?: MarketType): Promise<Asset[]> {
  console.log(`[SEARCH] Query: "${query}", marketType: ${marketType}`);
  if (query.length < 2) return [];

  const cache = (globalThis as any).searchCache ||= new Map();
  const cacheKey = `${query.toLowerCase()}-${marketType}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }

  const typeParam = marketType === 'crypto' ? 'crypto' :
    marketType === 'forex' ? 'Forex' :
    marketType === 'indian' ? 'Stock' : 'Stock';

  const params = new URLSearchParams({
    symbol: query,
    apikey: TWELVEDATA_API_KEY!,
    per_page: '15',
    type: typeParam,
  });

  if (marketType === 'indian') {
    params.append('exchange', 'NSE');
    params.append('country', 'India');
  }

  // Always compute fallback for comparison
  const allDefaults = [...DEFAULT_CRYPTO_ASSETS, ...DEFAULT_STOCK_ASSETS, ...DEFAULT_FOREX_ASSETS, ...DEFAULT_INDIAN_ASSETS];
  const fallbackResults = allDefaults
    .filter(a => 
      a.symbol.toLowerCase().includes(query.toLowerCase()) || 
      a.name.toLowerCase().includes(query.toLowerCase())
    )
    .map(asset => ({
      ...asset,
      price: MOCK_PRICES[asset.symbol.replace(/\/USD|\.NSE/g, '') as keyof typeof MOCK_PRICES]?.price || 100,
      change24h: MOCK_PRICES[asset.symbol.replace(/\/USD|\.NSE/g, '') as keyof typeof MOCK_PRICES]?.change24h || 0,
      marketType: asset.symbol.includes('.NSE') ? 'indian' : 
                  asset.symbol.includes('/') ? (asset.marketType || 'forex') : asset.marketType
    }))
    .slice(0, 15);
  console.log(`[SEARCH] Fallback ready: ${fallbackResults.length} results`);

  let apiResults: Asset[] = [];
  try {
    console.log(`[SEARCH] API URL: ${TWELVEDATA_BASE}/symbol_search?${params}`);
    const response = await fetch(`${TWELVEDATA_BASE}/symbol_search?${params}`, {
      next: { revalidate: 30 }
    });
    console.log(`[SEARCH] API response: ${response.status} ${response.statusText}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const data = result.data || [];
    console.log(`[SEARCH] API data.length: ${data.length}`);

    if (data.length === 0) {
      console.log('[SEARCH] API empty, using fallback');
      return fallbackResults;
    }

    const symbols = data.slice(0, 15).map((s: TwelveDataSymbol) => s.symbol);
    console.log(`[SEARCH] Quotes for ${symbols.join(',')}`);
    const prices = await fetchQuotesBatch(symbols, TWELVEDATA_API_KEY!);

    apiResults = data.slice(0, 15).map((s: TwelveDataSymbol) => {
      const priceData = prices[s.symbol] || ({} as TwelveDataQuote);
      const assetMarketType = marketType || (s.symbol.includes('.NSE') ? 'indian' : 
        s.symbol.includes('/') ? (s.symbol.includes('USD') ? 'forex' : 'crypto') : 'stocks') as MarketType;
      return {
        id: s.symbol,
        symbol: s.symbol,
        name: s.name || s.description || 'Unknown',
        price: priceData.close || 0,
        change24h: priceData.change_percentage || 0,
        volume: priceData.volume || 0,
        marketType: assetMarketType,
      };
    });

    cache.set(cacheKey, { data: apiResults, timestamp: Date.now() });
    console.log(`[SEARCH] API success: ${apiResults.length} results`);
    return apiResults;

  } catch (e) {
    console.error('[SEARCH] API failed:', e);
    console.log('[SEARCH] Using fallback:', fallbackResults.length, 'results');
    return fallbackResults;
  }
}

export async function fetchAssetsByMarket(marketType: MarketType): Promise<Asset[]> {
  switch (marketType) {
    case 'crypto':
      return fetchCryptoList();
    case 'stocks':
      return fetchStockList();
    case 'forex':
      return fetchForexList();
    case 'indian':
      return fetchIndianList();
    default:
      return [];
  }
}

export async function fetchCandleData(
  asset: Asset,
  timeframe: Timeframe
): Promise<CandleData[]> {
  const intervalMap: Record<Timeframe, string> = {
    '1m': '1min',
    '5m': '5min',
    '15m': '15min',
    '30m': '30min',
    '1h': '1h',
    '4h': '4h',
    '1D': '1day',
    '1W': '1week',
  };
  const interval = intervalMap[timeframe] || '1h';
  
  if (!TWELVEDATA_API_KEY) {
    return generateMockCandles(asset.price || 100, 200);
  }
  
  try {
    const response = await fetch(
      `${TWELVEDATA_BASE}/time_series?symbol=${encodeURIComponent(asset.symbol)}&interval=${interval}&outputsize=200&apikey=${TWELVEDATA_API_KEY}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) throw new Error('TwelveData candles fetch failed');
    const { values } = await response.json();
    
    return (values || []).slice().reverse().map((v: any) => ({
      time: new Date(v.datetime).getTime() / 1000,
      open: parseFloat(v.open),
      high: parseFloat(v.high),
      low: parseFloat(v.low),
      close: parseFloat(v.close),
      volume: parseFloat(v.volume) || 0,
    }));
  } catch (e) {
    console.warn('TwelveData candles failed, mock fallback', e);
    return generateMockCandles(asset.price || 100, 200);
  }
}

export function subscribeToPrice(
  asset: Asset,
  callback: (price: number, change: number) => void
): () => void {
  if (!TWELVEDATA_API_KEY) {
    // Mock WS simulation
    const basePrice = asset.price || 100;
    let currentPrice = basePrice;
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * basePrice * 0.001;
      currentPrice += change;
      const percentChange = ((currentPrice - basePrice) / basePrice) * 100;
      callback(currentPrice, percentChange);
    }, 2000);
    return () => clearInterval(interval);
  }
  
  try {
    const ws = new WebSocket(`wss://ws.twelvedata.com/v1/quotes/price?symbol=${encodeURIComponent(asset.symbol)}&apikey=${TWELVEDATA_API_KEY}`);
    
    ws.onopen = () => console.log(`WS subscribed to ${asset.symbol}`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data.price, data.change_percentage || 0);
    };
    ws.onerror = (err) => console.error('WS error', err);
    ws.onclose = () => console.log(`WS closed for ${asset.symbol}`);
    
    return () => {
      ws.close();
    };
  } catch (e) {
    console.warn('TwelveData WS failed, mock fallback', e);
    // Mock fallback
    const basePrice = asset.price || 100;
    let currentPrice = basePrice;
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * basePrice * 0.001;
      currentPrice += change;
      const percentChange = ((currentPrice - basePrice) / basePrice) * 100;
      callback(currentPrice, percentChange);
    }, 2000);
    return () => clearInterval(interval);
  }
}

