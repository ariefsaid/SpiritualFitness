import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import OfflineIndicator from '@/components/OfflineIndicator';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpiritualFit - Islamic Prayer & Quran Tracker',
  description: 'Track your prayer times, Quran reading progress, and join the community in your spiritual fitness journey.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} has-bottom-nav`}>
        <Providers>
          <OfflineIndicator />
          <Header />
          <main className="container mx-auto px-4 py-6">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}