'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { fetchForexList } from '@/lib/api';
import type { Asset } from '@/types/trading';
import { PageHeader } from './page-header';

export function ForexPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchForexList();
      setAssets(data);
      setFilteredAssets(data);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    const filtered = assets.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAssets(filtered);
  }, [searchQuery, assets]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight">Forex</h1>
          <p className="mt-2 text-muted-foreground">
            Trade currency pairs from global foreign exchange markets
          </p>
        </motion.div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search forex pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-secondary" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAssets.map((asset, index) => (
              <ForexCard key={asset.id} asset={asset} index={index} />
            ))}
          </div>
        )}

        {!isLoading && filteredAssets.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No forex pairs found for &quot;{searchQuery}&quot;
          </div>
        )}
      </main>
    </div>
  );
}

interface ForexCardProps {
  asset: Asset;
  index: number;
}

function ForexCard({ asset, index }: ForexCardProps) {
  const isPositive = asset.change24h >= 0;
  const [base, quote] = asset.symbol.split('/');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link href={`/?asset=${asset.id}&market=forex`}>
        <Card className="group cursor-pointer border-border/50 bg-card/50 transition-all hover:border-[var(--neon-blue)]/50 hover:shadow-lg hover:shadow-[var(--neon-blue)]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center -space-x-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-cyan)]/20 to-[var(--neon-blue)]/20 ring-2 ring-background">
                    <span className="text-xs font-bold">{base}</span>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/20 ring-2 ring-background">
                    <span className="text-xs font-bold">{quote}</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold">{asset.symbol}</p>
                  <p className="text-sm text-muted-foreground">{asset.name}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Rate</p>
                <p className="font-mono text-xl">
                  {asset.price?.toFixed(5) || '0.00000'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">24h Change</p>
                <p
                  className={`flex items-center justify-end gap-1 font-medium ${
                    isPositive ? 'text-[var(--success)]' : 'text-destructive'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {isPositive ? '+' : ''}
                  {asset.change24h?.toFixed(2) || '0.00'}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
