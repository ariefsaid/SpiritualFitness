import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';

// Dynamically import client components with no SSR
const OfflineIndicator = dynamic(() => import('@/components/OfflineIndicator'), { 
  ssr: false,
  loading: () => null
});

const Header = dynamic(() => import('@/components/Header'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"></div>
});

const BottomNav = dynamic(() => import('@/components/BottomNav'), {
  ssr: false,
  loading: () => null
});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'SpiritualFit - Islamic Spiritual Fitness App',
  description: 'Track prayers, fasting, and Quran reading with our Islamic spiritual fitness app that works offline',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#10b981',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SpiritualFit',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://spiritualfit.app',
    title: 'SpiritualFit - Islamic Spiritual Fitness App',
    description: 'Track prayers, fasting, and Quran reading with our Islamic spiritual fitness app',
    siteName: 'SpiritualFit',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen`}>
        <Providers>
          <Suspense fallback={null}>
            <OfflineIndicator />
          </Suspense>
          <Suspense fallback={<div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"></div>}>
            <Header />
          </Suspense>
          
          <main className="container mx-auto px-4 py-6 pb-24 md:pb-10">
            {children}
          </main>
          
          <Suspense fallback={null}>
            <BottomNav />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}