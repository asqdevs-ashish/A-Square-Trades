'use client';

import { create } from 'zustand';
import type { Asset, MarketType, Timeframe, DrawingTool, Indicator, Drawing, WatchlistItem } from '@/types/trading';
import { ALL_DEFAULT_ASSETS, INDICATORS } from './constants';

interface TradingStore {
  // Market state
  marketType: MarketType;
  setMarketType: (type: MarketType) => void;
  
  // Selected asset
  selectedAsset: Asset | null;
  setSelectedAsset: (asset: Asset) => void;
  
  // Timeframe
  timeframe: Timeframe;
  setTimeframe: (tf: Timeframe) => void;
  
  // Drawing tools
  activeDrawingTool: DrawingTool | null;
  setActiveDrawingTool: (tool: DrawingTool | null) => void;
  drawings: Drawing[];
  addDrawing: (drawing: Drawing) => void;
  removeDrawing: (id: string) => void;
  clearDrawings: () => void;
  
  // Indicators
  indicators: Indicator[];
  toggleIndicator: (id: string) => void;
  
  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (asset: Asset) => void;
  removeFromWatchlist: (id: string) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  
  // Sidebars
  isLeftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  isRightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
}

// Simple store without persistence to avoid hydration issues
const createStore = () => {
  return create<TradingStore>((set) => ({
    // Market state
    marketType: 'crypto',
    setMarketType: (type) => set({ marketType: type }),
    
    // Selected asset
    selectedAsset: ALL_DEFAULT_ASSETS[0],
    setSelectedAsset: (asset) => set({ selectedAsset: asset }),
    
    // Timeframe
    timeframe: '1h',
    setTimeframe: (tf) => set({ timeframe: tf }),
    
    // Drawing tools
    activeDrawingTool: null,
    setActiveDrawingTool: (tool) => set({ activeDrawingTool: tool }),
    drawings: [],
    addDrawing: (drawing) => set((state) => ({ drawings: [...state.drawings, drawing] })),
    removeDrawing: (id) => set((state) => ({ drawings: state.drawings.filter((d) => d.id !== id) })),
    clearDrawings: () => set({ drawings: [] }),
    
    // Indicators
    indicators: INDICATORS,
    toggleIndicator: (id) => set((state) => ({
      indicators: state.indicators.map((ind) =>
        ind.id === id ? { ...ind, active: !ind.active } : ind
      ),
    })),
    
    // Watchlist - start with defaults
    watchlist: ALL_DEFAULT_ASSETS.map((asset) => ({ ...asset, addedAt: Date.now() })),
    addToWatchlist: (asset) => set((state) => {
      if (state.watchlist.some((w) => w.id === asset.id)) return state;
      return { watchlist: [...state.watchlist, { ...asset, addedAt: Date.now() }] };
    }),
    removeFromWatchlist: (id) => set((state) => ({
      watchlist: state.watchlist.filter((w) => w.id !== id),
    })),
    
    // Search
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    isSearchOpen: false,
    setIsSearchOpen: (open) => set({ isSearchOpen: open }),
    
    // Sidebars
    isLeftSidebarOpen: true,
    toggleLeftSidebar: () => set((state) => ({ isLeftSidebarOpen: !state.isLeftSidebarOpen })),
    isRightSidebarOpen: true,
    toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
  }));
};

// Create store lazily to avoid SSR issues
let store: ReturnType<typeof createStore> | null = null;

export const useTradingStore = () => {
  if (typeof window === 'undefined') {
    // Return a mock during SSR
    return createStore()();
  }
  
  if (!store) {
    store = createStore();
  }
  
  return store();
};
