'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

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

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}