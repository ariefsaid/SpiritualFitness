import type { Metadata, Viewport } from 'next';
import { Providers } from './providers';
import { Inter } from 'next/font/google';
import { ClientLayout } from '@/components/ClientComponentsWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#10b981',
};

export const metadata: Metadata = {
  title: 'SpiritualFit - Islamic Spiritual Fitness App',
  description: 'Track prayers, fasting, and Quran reading with our Islamic spiritual fitness app that works offline',
  manifest: '/manifest.json',
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
      <body suppressHydrationWarning className={`${inter.variable} font-sans bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen`}>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}