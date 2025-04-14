'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorkerRegistration() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  
  useEffect(() => {
    // Only register service worker in production and if the browser supports it
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
            setIsRegistered(true);
            
            // Check for updates on page load
            registration.addEventListener('updatefound', () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) return;
              
              installingWorker.addEventListener('statechange', () => {
                if (installingWorker.state === 'installed' && 
                    navigator.serviceWorker.controller) {
                  // New service worker is waiting
                  console.log('New version available! Ready to update.');
                  setUpdateAvailable(true);
                }
              });
            });
          })
          .catch((error) => {
            console.error('ServiceWorker registration failed: ', error);
          });
          
        // Handle controller change (when a new SW takes over)
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      });
    }
  }, []);
  
  // Function to update the service worker
  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update();
      });
    }
  };
  
  // If an update is available, show a toast or notification
  useEffect(() => {
    if (updateAvailable) {
      // We could show a toast notification here
      console.log('A new version is available. Refresh to update.');
      
      // For now, let's just log and auto-update
      updateServiceWorker();
    }
  }, [updateAvailable]);
  
  // This component doesn't render anything visible
  return null;
}