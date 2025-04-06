const CACHE_NAME = 'spiritualfit-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
];

// API routes that should be cached for offline use
const API_CACHE_ROUTES = [
  '/api/quotes/random',
  '/api/quotes/category/motivation',
  '/api/challenges',
  '/api/community/groups',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline operations
self.addEventListener('sync', (event) => {
  if (event.tag === 'syncOfflineData') {
    event.waitUntil(syncOfflineData());
  }
});

// Helper function to synchronize offline data
async function syncOfflineData() {
  try {
    const response = await fetch('/api/sync/pending');
    if (response.ok) {
      const pendingSyncs = await response.json();
      
      for (const sync of pendingSyncs) {
        try {
          const syncResponse = await fetch(sync.endpoint, {
            method: sync.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sync.payload),
          });
          
          if (syncResponse.ok) {
            // Mark sync as completed
            await fetch(`/api/sync/${sync.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'completed' }),
            });
          }
        } catch (error) {
          console.error('Error syncing item:', error);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching pending sync items:', error);
  }
}

// Fetch event - serve from cache and update cache with network response
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // For API requests
  if (event.request.url.includes('/api/')) {
    // Check if this is a cacheable API route
    const isCacheableApiRoute = API_CACHE_ROUTES.some(route => 
      event.request.url.includes(route));
    
    if (isCacheableApiRoute) {
      // Network first, fallback to cache strategy for cacheable API routes
      event.respondWith(
        fetch(event.request)
          .then(response => {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match(event.request);
          })
      );
    } else if (event.request.method === 'GET') {
      // For non-cacheable GET API routes, try network, but don't cache
      event.respondWith(
        fetch(event.request).catch(() => {
          return caches.match(event.request);
        })
      );
    }
    return;
  }

  // For non-API requests (static assets, HTML, etc.)
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Return cached response if available
      if (cachedResponse) {
        // Try to update the cache in the background
        fetch(event.request).then(response => {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response);
          });
        }).catch(() => {
          // Silently fail - we already have the cached version
        });
        
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(event.request).then(response => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response as it can only be consumed once
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
