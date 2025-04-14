'use client';

import { useState, useEffect } from 'react';

export function useOffline(): boolean {
  // Initialize with a default value that won't cause a flash on hydration
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    // Always return false during SSR to prevent hydration mismatch
    if (typeof window === 'undefined') {
      return false;
    }
    // Only check navigator.onLine on the client
    return !navigator.onLine;
  });
  
  useEffect(() => {
    // Safety check for browser environment
    if (typeof window === 'undefined') return;
    
    // Add event listeners for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    // Make sure initial state is correct
    setIsOffline(!navigator.onLine);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOffline;
}