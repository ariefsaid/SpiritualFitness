'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import client components
const OfflineIndicator = dynamic(() => import('@/components/OfflineIndicator'), { 
  loading: () => null
});

const Header = dynamic(() => import('@/components/Header'), {
  loading: () => <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700"></div>
});

const BottomNav = dynamic(() => import('@/components/BottomNav'), {
  loading: () => null
});

// Import service worker registration - no SSR needed
const ServiceWorkerRegistration = dynamic(
  () => import('@/components/ServiceWorkerRegistration'),
  { ssr: false }
);

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Register service worker for PWA capabilities */}
      <ServiceWorkerRegistration />
      
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