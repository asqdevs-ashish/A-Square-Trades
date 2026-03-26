import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'A Square Trade - Advanced Trading Platform',
    template: '%s | A² Trade',
  },
  description: 'A Square Trade - Professional trading platform with real-time charts, advanced indicators, and multi-market support for Crypto, Stocks, and Forex.',
  keywords: ['trading', 'crypto', 'stocks', 'forex', 'charts', 'technical analysis', 'indicators', 'trading platform'],
  authors: [{ name: 'A² Trade' }],
  creator: 'A² Trade',
  publisher: 'A² Trade',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://a2trade.com',
    siteName: 'A Square Trade',
    title: 'A² Trade - Advanced Trading Platform',
    description: 'Professional trading platform with real-time charts, advanced indicators, and multi-market support.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'A² Trade Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A² Trade - Advanced Trading Platform',
    description: 'Professional trading platform with real-time charts and advanced indicators.',
    images: ['/og-image.png'],
    creator: '@a2trade',
  },
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.ico',
    apple: '/logo.ico',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0b0f19',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
