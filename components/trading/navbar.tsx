'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  BarChart3,
  TrendingUp,
  DollarSign,
  Bitcoin,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTradingStore } from '@/lib/store';
import { TIMEFRAMES } from '@/lib/constants';
import type { MarketType, Timeframe } from '@/types/trading';
import { SearchDialog } from './search-dialog';
import { IndicatorPanel } from './indicator-panel';

const marketOptions: { value: MarketType; label: string; icon: React.ReactNode }[] = [
  { value: 'crypto', label: 'Crypto', icon: <Bitcoin className="h-4 w-4" /> },
  { value: 'stocks', label: 'Stocks', icon: <TrendingUp className="h-4 w-4" /> },
  { value: 'forex', label: 'Forex', icon: <DollarSign className="h-4 w-4" /> },
  { value: 'indian', label: 'Indian', icon: <TrendingUp className="h-4 w-4" /> },
];

export function Navbar() {
  const {
    marketType,
    setMarketType,
    timeframe,
    setTimeframe,
    selectedAsset,
    toggleLeftSidebar,
    toggleRightSidebar,
  } = useTradingStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isIndicatorOpen, setIsIndicatorOpen] = useState(false);

  const currentMarket = marketOptions.find((m) => m.value === marketType);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-sm"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleLeftSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)]">
              <span className="text-sm font-bold text-white">A²</span>
            </div>
            <span className="hidden text-lg font-semibold tracking-tight sm:inline neon-text">
              Trade
            </span>
          </div>

          <div className="hidden h-6 w-px bg-border md:block" />

          {/* Market Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                {currentMarket?.icon}
                <span className="hidden sm:inline">{currentMarket?.label}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {marketOptions.map((market) => (
                <DropdownMenuItem
                  key={market.value}
                  onClick={() => setMarketType(market.value)}
                  className="gap-2"
                >
                  {market.icon}
                  {market.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Button */}
          <Button
            variant="outline"
            className="hidden w-64 justify-start gap-2 text-muted-foreground md:flex"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span>Search {selectedAsset?.symbol || 'assets'}...</span>
            <kbd className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
              /
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Asset Info */}
          <AnimatePresence mode="wait">
            {selectedAsset && (
              <motion.div
                key={selectedAsset.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="hidden items-center gap-3 lg:flex"
              >
                <span className="font-semibold">{selectedAsset.symbol}</span>
                <span className="font-mono text-lg">
                  ${selectedAsset.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </span>
                <span
                  className={`text-sm font-medium ${
                    (selectedAsset.change24h || 0) >= 0
                      ? 'text-[var(--success)]'
                      : 'text-destructive'
                  }`}
                >
                  {(selectedAsset.change24h || 0) >= 0 ? '+' : ''}
                  {selectedAsset.change24h?.toFixed(2) || '0.00'}%
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="hidden h-6 w-px bg-border lg:block" />

          {/* Timeframe Selector */}
          <div className="hidden items-center gap-1 lg:flex">
            {TIMEFRAMES.map((tf) => (
              <Button
                key={tf.value}
                variant={timeframe === tf.value ? 'default' : 'ghost'}
                size="sm"
                className={`h-7 px-2 text-xs ${
                  timeframe === tf.value
                    ? 'bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] hover:bg-[var(--neon-blue)]/30'
                    : ''
                }`}
                onClick={() => setTimeframe(tf.value as Timeframe)}
              >
                {tf.label}
              </Button>
            ))}
          </div>

          {/* Mobile Timeframe Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="lg:hidden">
              <Button variant="outline" size="sm" className="gap-1">
                {timeframe}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {TIMEFRAMES.map((tf) => (
                <DropdownMenuItem
                  key={tf.value}
                  onClick={() => setTimeframe(tf.value as Timeframe)}
                >
                  {tf.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Indicators Button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setIsIndicatorOpen(true)}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Indicators</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleRightSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </motion.nav>

      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <IndicatorPanel open={isIndicatorOpen} onOpenChange={setIsIndicatorOpen} />
    </>
  );
}
