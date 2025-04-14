import { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import OfflineIndicator from "@/components/OfflineIndicator";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'SpiritualFit - Muslim Prayer & Quran Tracker',
  description: 'Islamic PWA for tracking prayers, fasting, and Quran reading with fitness-inspired goals',
  manifest: '/manifest.json',
  themeColor: '#10B981',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SpiritualFit',
  },
  icons: {
    icon: '/icons/icon-192.png',
    apple: [
      { url: '/icons/icon-192.png' },
      { url: '/icons/icon-152.png', sizes: '152x152' },
      { url: '/icons/icon-192.png', sizes: '180x180' },
      { url: '/icons/icon-152.png', sizes: '167x167' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen relative">
            <OfflineIndicator />
            <Header />
            <main className="flex-grow relative has-bottom-nav md:pb-0">
              <div className="islamic-pattern absolute inset-0 pointer-events-none"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {children}
              </div>
            </main>
            <FloatingActionButton />
            <BottomNav />
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}