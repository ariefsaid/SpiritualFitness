'use client';

import { useState, useEffect } from 'react';

// Function to actively check connectivity by pinging an API endpoint
async function checkConnectivity(): Promise<boolean> {
  try {
    // Try to fetch a small static resource to verify connectivity
    // Use a timestamp query parameter to avoid cache
    const response = await fetch('/api/test?_=' + Date.now(), {
      method: 'HEAD', // Just check headers, we don't need content
      cache: 'no-store', // Avoid cache
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

export function useOffline(): boolean {
  // Start with false to avoid hydration mismatch
  const [isOffline, setIsOffline] = useState<boolean>(false);
  
  // Use separate state for mounted check to avoid hydration issues
  const [isMounted, setIsMounted] = useState<boolean>(false);
  
  // Active check in addition to browser events
  useEffect(() => {
    // Mark component as mounted after hydration
    setIsMounted(true);
    
    // Initial check based on navigator.onLine
    if (typeof navigator !== 'undefined') {
      setIsOffline(!navigator.onLine);
      
      // Also actively check connectivity
      if (navigator.onLine) {
        checkConnectivity().then(isConnected => {
          // Only update if result differs from current navigator.onLine
          if (!isConnected && navigator.onLine) {
            setIsOffline(true);
          }
        });
      }
    }
    
    // Add event listeners for online/offline events
    const handleOnline = () => {
      // When browser says we're online, validate with an active check
      checkConnectivity().then(isConnected => {
        setIsOffline(!isConnected);
      });
    };
    
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set up periodic connectivity checks
    const intervalId = setInterval(() => {
      // Only do active checks if the browser thinks we're online
      // This prevents constant fetch attempts when offline
      if (navigator.onLine) {
        checkConnectivity().then(isConnected => {
          // Only update if result differs from current navigator.onLine
          if (!isConnected && navigator.onLine) {
            setIsOffline(true);
          } else if (isConnected && !navigator.onLine) {
            setIsOffline(false);
          }
        });
      }
    }, 30000); // Check every 30 seconds
    
    // Clean up event listeners and interval
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);
  
  // Return false until component is mounted to ensure consistent hydration
  return isMounted ? isOffline : false;
}