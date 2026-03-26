'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, X, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTradingStore } from '@/lib/store';
import { subscribeToPrice } from '@/lib/api';
import type { WatchlistItem } from '@/types/trading';

export function Watchlist() {
  const {
    isRightSidebarOpen,
    watchlist,
    selectedAsset,
    setSelectedAsset,
    removeFromWatchlist,
  } = useTradingStore();

  return (
    <AnimatePresence>
      {isRightSidebarOpen && (
      <motion.aside
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 60, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="flex h-screen w-72 max-h-screen flex-col overflow-hidden border-l border-border bg-sidebar"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-[var(--neon-blue)]" />
              <span className="font-semibold">Watchlist</span>
            </div>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
              {watchlist.length}
            </span>
          </div>

          <ScrollArea className="flex-1 [&amp;_data-radix-scroll-area-scrollbar]:w-2 [&amp;_data-radix-scroll-area-scrollbar-track]:bg-[#0b0f19]/50 [&amp;_data-radix-scroll-area-scrollbar-thumb]:bg-gradient-to-b from-[var(--neon-blue)]/70 to-[var(--neon-purple)]/70 hover:[&amp;_data-radix-scroll-area-scrollbar-thumb]:opacity-100 rounded-full transition-all duration-200 scroll-smooth max-h-full overflow-hidden p-2">
            <div className="p-2">
              <AnimatePresence>
                {watchlist.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground"
                  >
                    <Star className="mb-2 h-8 w-8" />
                    <p className="text-sm">No assets in watchlist</p>
                    <p className="text-xs">Search to add assets</p>
                  </motion.div>
                ) : (
                  watchlist.map((item, index) => (
                    <WatchlistItemRow
                      key={item.id}
                      item={item}
                      index={index}
                      isSelected={selectedAsset?.id === item.id}
                      onSelect={() => setSelectedAsset(item)}
                      onRemove={() => removeFromWatchlist(item.id)}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <div className="border-t border-border p-2">
            <Button variant="outline" className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Asset
            </Button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

interface WatchlistItemRowProps {
  item: WatchlistItem;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

function WatchlistItemRow({
  item,
  index,
  isSelected,
  onSelect,
  onRemove,
}: WatchlistItemRowProps) {
  const [price, setPrice] = useState(item.price);
  const [change, setChange] = useState(item.change24h);
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToPrice(item, (newPrice, newChange) => {
      if (newPrice > price) {
        setPriceFlash('up');
      } else if (newPrice < price) {
        setPriceFlash('down');
      }
      setPrice(newPrice);
      setChange(newChange);

      setTimeout(() => setPriceFlash(null), 500);
    });

    return unsubscribe;
  }, [item, price]);

  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative mb-1 rounded-lg transition-colors ${
        isSelected
          ? 'bg-[var(--neon-blue)]/10 border border-[var(--neon-blue)]/30'
          : 'hover:bg-secondary/50'
      } ${priceFlash === 'up' ? 'price-flash-up' : ''} ${
        priceFlash === 'down' ? 'price-flash-down' : ''
      }`}
    >
      <button
        className="flex w-full items-center justify-between p-3 text-left"
        onClick={onSelect}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20">
            <span className="text-xs font-bold">{item.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <div className="text-sm font-semibold">{item.symbol}</div>
            <div className="text-xs text-muted-foreground">
              {item.marketType.charAt(0).toUpperCase() + item.marketType.slice(1)}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-sm">
            ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </div>
          <div
            className={`flex items-center justify-end gap-1 text-xs ${
              isPositive ? 'text-[var(--success)]' : 'text-destructive'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? '+' : ''}
            {change?.toFixed(2) || '0.00'}%
          </div>
        </div>
      </button>

      <button
        className="absolute right-1 top-1 hidden rounded p-1 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive group-hover:block"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
}
