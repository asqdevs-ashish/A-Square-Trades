import type { Metadata } from 'next';
import { CryptoPage } from '@/components/pages/crypto-page';

export const metadata: Metadata = {
  title: 'Cryptocurrency Trading',
  description: 'Trade cryptocurrencies with advanced charting tools. Bitcoin, Ethereum, Solana and more with real-time data.',
  keywords: ['cryptocurrency', 'bitcoin', 'ethereum', 'crypto trading', 'BTC', 'ETH', 'SOL'],
  openGraph: {
    title: 'Cryptocurrency Trading | A² Trade',
    description: 'Trade cryptocurrencies with advanced charting tools and real-time data.',
    url: 'https://a-square-trades.vercel.app/crypto',
  },
  twitter: {
    title: 'Cryptocurrency Trading | A² Trade',
    description: 'Trade cryptocurrencies with advanced charting tools and real-time data.',
  },
  alternates: {
    canonical: 'https://a-square-trades.vercel.app/crypto',
  },
};

export default function Crypto() {
  return <CryptoPage />;
}
