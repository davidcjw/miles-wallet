import type { Metadata, Viewport } from 'next';
import './globals.css';
import Pwa from '@/components/Pwa';

const SITE_URL = 'https://miles-wallet.davidcjw.com';
const DESCRIPTION =
  'Track your bank credit card points and loyalty programme miles in one place — converted to your chosen airline programme, stored locally in your browser.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Miles Wallet — track bank points & loyalty miles',
  description: DESCRIPTION,
  applicationName: 'Miles Wallet',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Miles Wallet',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  alternates: { canonical: '/' },
  keywords: [
    'miles tracker',
    'credit card points',
    'loyalty miles',
    'KrisFlyer',
    'Asia Miles',
    'Singapore banks',
    'points to miles converter',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Miles Wallet',
    title: 'Miles Wallet — track bank points & loyalty miles',
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Miles Wallet dashboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miles Wallet — track bank points & loyalty miles',
    description: DESCRIPTION,
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Miles Wallet',
  url: SITE_URL,
  description: DESCRIPTION,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Pwa />
      </body>
    </html>
  );
}
