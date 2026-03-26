import type { Metadata } from 'next';
import { MarketsPage } from '@/components/pages/markets-page';

export const metadata: Metadata = {
  title: 'Markets',
  description: 'Explore all available markets including cryptocurrencies, stocks, and forex pairs. Real-time prices and market data.',
  keywords: ['markets', 'crypto markets', 'stock markets', 'forex markets', 'trading'],
  openGraph: {
    title: 'Markets | A² Trade',
    description: 'Explore all available markets including cryptocurrencies, stocks, and forex pairs.',
    url: 'https://a-square-trades.vercel.app/markets',
  },
  twitter: {
    title: 'Markets | A² Trade',
    description: 'Explore all available markets including cryptocurrencies, stocks, and forex pairs.',
  },
  alternates: {
    canonical: 'https://a-square-trades.vercel.app/markets',
  },
};

export default function Markets() {
  return <MarketsPage />;
}
