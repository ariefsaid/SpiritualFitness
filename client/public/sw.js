const CACHE_NAME = 'spiritualfit-v1';
const OFFLINE_URL = '/offline.html';
const OFFLINE_CACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png'
];

// Install event - cache essential files for offline use
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(OFFLINE_CACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For API requests, try network first, then cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // For non-API requests, try cache first
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Cache successful responses
          if (response && response.status === 200 && response.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }
          
          return response;
        }).catch(() => {
          // If both cache and network fail, serve the offline page
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData());
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const title = data.title || 'SpiritualFit';
  const options = {
    body: data.body || 'New notification',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png'
  };
  
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If already open, focus that client
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not open, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Handle offline data synchronization
async function syncOfflineData() {
  try {
    const offlineData = await fetchOfflineDataFromIndexedDB();
    
    for (const item of offlineData) {
      try {
        // Attempt to sync each item with the server
        await fetch(item.endpoint, {
          method: item.method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item.payload)
        });
        
        // If successful, remove from IndexedDB
        await removeFromIndexedDB(item.id);
      } catch (err) {
        console.error('Failed to sync item:', item, err);
      }
    }
  } catch (err) {
    console.error('Error syncing offline data:', err);
  }
}

// Fetch offline data from IndexedDB
async function fetchOfflineDataFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('spiritualfit-offline', 1);
    
    openRequest.onerror = () => reject(openRequest.error);
    
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const transaction = db.transaction('sync-data', 'readonly');
      const store = transaction.objectStore('sync-data');
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    };
    
    openRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('sync-data')) {
        db.createObjectStore('sync-data', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Remove synced item from IndexedDB
async function removeFromIndexedDB(id) {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open('spiritualfit-offline', 1);
    
    openRequest.onerror = () => reject(openRequest.error);
    
    openRequest.onsuccess = () => {
      const db = openRequest.result;
      const transaction = db.transaction('sync-data', 'readwrite');
      const store = transaction.objectStore('sync-data');
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    };
  });
}