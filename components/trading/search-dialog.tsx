'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Star, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTradingStore } from '@/lib/store';
import { fetchAssetsByMarket, fetchSymbolSearch } from '@/lib/api';
import type { Asset } from '@/types/trading';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { marketType, setSelectedAsset, watchlist, addToWatchlist } = useTradingStore();
  const [query, setQuery] = useState('');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchResults, setSearchResults] = useState<Asset[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches] = useState<Asset[]>([]);

  // Load full list only when dialog opens with no query (for recent/defaults)
  useEffect(() => {
    if (open && query.length === 0) {
      setIsLoading(true);
      fetchAssetsByMarket(marketType)
        .then(setAssets)
        .finally(() => setIsLoading(false));
    }
  }, [open, marketType, query]);

  // Debounced dynamic search
  useEffect(() => {
    if (query.length < 2 || !open) {
      setSearchResults([]);
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await fetchSymbolSearch(query, marketType);
        setSearchResults(results.slice(0, 15));
      } catch (e) {
        console.warn('Search failed', e);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    setDebounceTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query, marketType, open]);

  const displayAssets = query.length === 0 ? assets : searchResults;
  const toShow = displayAssets.slice(0, 15);

  const handleSelect = useCallback((asset: Asset) => {
    setSelectedAsset(asset);
    onOpenChange(false);
    setQuery('');
  }, [setSelectedAsset, onOpenChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === '/' && !open) {
      e.preventDefault();
      onOpenChange(true);
    }
  }, [open, onOpenChange]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const isInWatchlist = (id: string) => watchlist.some((w) => w.id === id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-xl">
        <VisuallyHidden>
          <DialogTitle>Search Assets</DialogTitle>
        </VisuallyHidden>
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={`Search ${marketType} assets...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 bg-transparent text-lg focus-visible:ring-0"
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--neon-blue)] border-t-transparent" />
            </div>
          ) : (
            <div className="p-2">
              {recentSearches.length > 0 && !query && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </div>
                  {recentSearches.map((asset) => (
                    <AssetItem
                      key={asset.id}
                      asset={asset}
                      onSelect={handleSelect}
                      isInWatchlist={isInWatchlist(asset.id)}
                      onAddToWatchlist={() => addToWatchlist(asset)}
                    />
                  ))}
                </div>
              )}

              <AnimatePresence mode="popLayout">
                {toShow.length > 0 ? (
                toShow.map((asset, index) => (
                  <motion.div
                    key={`${asset.id}-${index}`} // Unique key: id + index prevents duplicates
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <AssetItem
                        asset={asset}
                        onSelect={handleSelect}
                        isInWatchlist={isInWatchlist(asset.id)}
                        onAddToWatchlist={() => addToWatchlist(asset)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    No assets found for &quot;{query}&quot;
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface AssetItemProps {
  asset: Asset;
  onSelect: (asset: Asset) => void;
  isInWatchlist: boolean;
  onAddToWatchlist: () => void;
}

function AssetItem({ asset, onSelect, isInWatchlist, onAddToWatchlist }: AssetItemProps) {
  const isPositive = asset.change24h >= 0;

  return (
    <motion.button
      whileHover={{ backgroundColor: 'var(--secondary)' }}
      whileTap={{ scale: 0.98 }}
      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors"
      onClick={() => onSelect(asset)}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20">
          <span className="text-sm font-bold">{asset.symbol.slice(0, 2)}</span>
        </div>
          <div>
            <div className="font-semibold">{asset.symbol}</div>
            <div className="text-sm text-muted-foreground">{asset.name}</div>
            <div className="text-xs opacity-75 capitalize">{asset.marketType}</div>
          </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-mono">
            ${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </div>
          <div
            className={`flex items-center justify-end gap-1 text-sm ${
              isPositive ? 'text-[var(--success)]' : 'text-destructive'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? '+' : ''}
            {asset.change24h?.toFixed(2) || '0.00'}%
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onAddToWatchlist();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onAddToWatchlist();
            }
          }}
          className={`rounded-lg p-2 transition-colors cursor-pointer select-none ${
            isInWatchlist
              ? 'text-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/10'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <Star className={`h-4 w-4 ${isInWatchlist ? 'fill-current' : ''}`} />
        </div>
      </div>
    </motion.button>
  );
}
