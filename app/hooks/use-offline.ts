'use client';

import { useState, useEffect } from 'react';

export function useOffline(): boolean {
  // Start with false to avoid hydration mismatch
  const [isOffline, setIsOffline] = useState<boolean>(false);
  
  // Use separate state for mounted check to avoid hydration issues
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  useEffect(() => {
    // Mark component as mounted after hydration
    setIsMounted(true);
    
    // Check network status only after component is mounted
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
    }
    
    // Add event listeners for online/offline events
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Return false until component is mounted to ensure consistent hydration
  return isMounted ? isOffline : false;
}