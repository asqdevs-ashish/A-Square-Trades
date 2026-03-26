import type { Metadata } from 'next';
import { StocksPage } from '@/components/pages/stocks-page';

export const metadata: Metadata = {
  title: 'Stock Trading',
  description: 'Trade stocks with professional charting tools. Apple, Tesla, Microsoft and more with real-time market data.',
  keywords: ['stocks', 'stock trading', 'AAPL', 'TSLA', 'MSFT', 'equity trading'],
  openGraph: {
    title: 'Stock Trading | A² Trade',
    description: 'Trade stocks with professional charting tools and real-time market data.',
    url: 'https://a2trade.com/stocks',
  },
  twitter: {
    title: 'Stock Trading | A² Trade',
    description: 'Trade stocks with professional charting tools and real-time market data.',
  },
  alternates: {
    canonical: 'https://a2trade.com/stocks',
  },
};

export default function Stocks() {
  return <StocksPage />;
}
