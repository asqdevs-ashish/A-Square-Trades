'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Bitcoin, BarChart3, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchCryptoList, fetchStockList, fetchForexList } from '@/lib/api';
import type { Asset } from '@/types/trading';
import { PageHeader } from './page-header';

export function MarketsPage() {
  const [cryptoAssets, setCryptoAssets] = useState<Asset[]>([]);
  const [stockAssets, setStockAssets] = useState<Asset[]>([]);
  const [forexAssets, setForexAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const [crypto, stocks, forex] = await Promise.all([
        fetchCryptoList(),
        fetchStockList(),
        fetchForexList(),
      ]);
      setCryptoAssets(crypto);
      setStockAssets(stocks);
      setForexAssets(forex);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight">Markets</h1>
          <p className="mt-2 text-muted-foreground">
            Explore and trade across multiple asset classes
          </p>
        </motion.div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
            <TabsTrigger value="all">All Markets</TabsTrigger>
            <TabsTrigger value="crypto" className="gap-2">
              <Bitcoin className="h-4 w-4" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="stocks" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Stocks
            </TabsTrigger>
            <TabsTrigger value="forex" className="gap-2">
              <DollarSign className="h-4 w-4" />
              Forex
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            <MarketSection title="Cryptocurrencies" assets={cryptoAssets} isLoading={isLoading} href="/crypto" />
            <MarketSection title="Stocks" assets={stockAssets} isLoading={isLoading} href="/stocks" />
            <MarketSection title="Forex" assets={forexAssets} isLoading={isLoading} href="/forex" />
          </TabsContent>

          <TabsContent value="crypto">
            <AssetGrid assets={cryptoAssets} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="stocks">
            <AssetGrid assets={stockAssets} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="forex">
            <AssetGrid assets={forexAssets} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

interface MarketSectionProps {
  title: string;
  assets: Asset[];
  isLoading: boolean;
  href: string;
}

function MarketSection({ title, assets, isLoading, href }: MarketSectionProps) {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Link href={href}>
          <Button variant="ghost" size="sm" className="gap-2">
            View All
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-secondary" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {assets.slice(0, 5).map((asset, index) => (
              <AssetCard key={asset.id} asset={asset} index={index} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AssetGridProps {
  assets: Asset[];
  isLoading: boolean;
}

function AssetGrid({ assets, isLoading }: AssetGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-secondary" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset, index) => (
        <AssetCard key={asset.id} asset={asset} index={index} />
      ))}
    </div>
  );
}

interface AssetCardProps {
  asset: Asset;
  index: number;
}

function AssetCard({ asset, index }: AssetCardProps) {
  const isPositive = asset.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/?asset=${asset.id}&market=${asset.marketType}`}>
        <Card className="group cursor-pointer border-border/50 bg-card/50 transition-all hover:border-[var(--neon-blue)]/50 hover:shadow-lg hover:shadow-[var(--neon-blue)]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20">
                  <span className="text-sm font-bold">{asset.symbol.slice(0, 2)}</span>
                </div>
                <div>
                  <p className="font-semibold">{asset.symbol}</p>
                  <p className="text-xs text-muted-foreground">{asset.name}</p>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <span className="font-mono text-lg">
                ${asset.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </span>
              <span
                className={`flex items-center gap-1 text-sm font-medium ${
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
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
