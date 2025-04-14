'use client';

import { useState, useEffect } from 'react';
import { useOffline } from '@/hooks/use-offline';

export default function OfflineIndicator() {
  const [isMounted, setIsMounted] = useState(false);
  const isOffline = useOffline();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Don't render anything during SSR to avoid hydration mismatch
  if (!isMounted) return null;
  
  if (!isOffline) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white text-center py-1 text-sm">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16.72 16.72C15.4515 17.5734 13.9669 18.0444 12.445 18.0444C10.9231 18.0444 9.43851 17.5734 8.17 16.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5.18 13.89C4.35 12.63 3.89 11.11 3.89 9.5C3.89 5.35 7.76 2 12.45 2C15.28 2 17.81 3.34 19.41 5.44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1 6C3 8.4 5.4 10.5 8 12.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12.55 16.01C13.3 16.01 14.01 15.33 14.01 14.51C14.01 13.69 13.33 13.01 12.51 13.01C11.69 13.01 11.01 13.69 11.01 14.51C11.01 15.33 11.71 16.01 12.55 16.01Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13.59 13.95L17.5 10.05" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        You are currently offline. Some features may be limited.
      </div>
    </div>
  );
}