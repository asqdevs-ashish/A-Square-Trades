import type { Metadata } from 'next';
import { AboutPage } from '@/components/pages/about-page';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about A² Trade - the advanced trading platform built for modern traders. Our mission, team, and technology.',
  keywords: ['about', 'A² Trade', 'trading platform', 'about us', 'our mission'],
  openGraph: {
    title: 'About Us | A² Trade',
    description: 'Learn about A² Trade - the advanced trading platform built for modern traders.',
    url: 'https://a-square-trades.vercel.app/about',
  },
  twitter: {
    title: 'About Us | A² Trade',
    description: 'Learn about A² Trade - the advanced trading platform built for modern traders.',
  },
  alternates: {
    canonical: 'https://a-square-trades.vercel.app/about',
  },
};

export default function About() {
  return <AboutPage />;
}
