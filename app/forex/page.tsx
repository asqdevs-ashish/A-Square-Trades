import type { Metadata } from 'next';
import { ForexPage } from '@/components/pages/forex-page';

export const metadata: Metadata = {
  title: 'Forex Trading',
  description: 'Trade forex currency pairs with advanced analysis tools. EUR/USD, GBP/USD, USD/JPY and more.',
  keywords: ['forex', 'currency trading', 'EUR/USD', 'GBP/USD', 'foreign exchange'],
  openGraph: {
    title: 'Forex Trading | A² Trade',
    description: 'Trade forex currency pairs with advanced analysis tools.',
    url: 'https://a2trade.com/forex',
  },
  twitter: {
    title: 'Forex Trading | A² Trade',
    description: 'Trade forex currency pairs with advanced analysis tools.',
  },
  alternates: {
    canonical: 'https://a2trade.com/forex',
  },
};

export default function Forex() {
  return <ForexPage />;
}
