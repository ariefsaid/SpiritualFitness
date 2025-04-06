/**
 * Service worker registration for PWA features
 * Enables offline functionality, background syncing, and push notifications
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registered with scope:', registration.scope);
          
          // Check for updates to the service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available - show update notification if desired
                  console.log('New service worker installed - update available');
                }
              });
            }
          });
          
          // Enable background sync for offline operations
          if ('sync' in registration) {
            document.addEventListener('online', () => {
              registration.sync.register('syncOfflineData')
                .catch(err => console.error('Background sync registration failed:', err));
            });
          }
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
}

/**
 * Checks if the app is currently in offline mode
 */
export function isOffline() {
  return !navigator.onLine;
}

/**
 * Registers data for background syncing when back online
 * @param endpoint API endpoint to call when online
 * @param method HTTP method to use
 * @param payload Data to send
 */
export async function registerOfflineSync(endpoint: string, method: string, payload: any) {
  try {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      
      // Store the sync request in IndexedDB or LocalStorage
      await storeOfflineSyncRequest(endpoint, method, payload);
      
      // Register for background sync if online
      if (navigator.onLine) {
        await registration.sync.register('syncOfflineData');
      }
      
      return true;
    } else {
      // Fallback for browsers without background sync
      if (navigator.onLine) {
        return await performSync(endpoint, method, payload);
      } else {
        await storeOfflineSyncRequest(endpoint, method, payload);
        return true;
      }
    }
  } catch (error) {
    console.error('Failed to register offline sync:', error);
    return false;
  }
}

/**
 * Helper to store offline sync requests in local storage
 */
async function storeOfflineSyncRequest(endpoint: string, method: string, payload: any) {
  try {
    // Get existing pending syncs
    const existingSyncsStr = localStorage.getItem('pendingSyncs') || '[]';
    const existingSyncs = JSON.parse(existingSyncsStr);
    
    // Add new sync request
    existingSyncs.push({
      id: Date.now().toString(),
      endpoint,
      method,
      payload,
      createdAt: new Date().toISOString()
    });
    
    // Store updated syncs
    localStorage.setItem('pendingSyncs', JSON.stringify(existingSyncs));
    
    return true;
  } catch (error) {
    console.error('Failed to store offline sync request:', error);
    return false;
  }
}

/**
 * Performs actual sync request
 */
async function performSync(endpoint: string, method: string, payload: any) {
  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Sync request failed:', error);
    return false;
  }
}

/**
 * Request push notification permission
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(userId: number) {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported');
      return false;
    }
    
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return false;
    }
    
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        // This would be your VAPID public key
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      )
    });
    
    // Send the subscription to your server
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        subscription
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
}

/**
 * Helper function to convert URL-safe base64 to Uint8Array
 * Required for applicationServerKey
 */
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}