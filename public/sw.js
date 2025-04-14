// Service Worker for SpiritualFit PWA
const CACHE_NAME = 'spiritualfit-cache-v1';

// Resources to cache immediately when the service worker installs
const PRE_CACHE_RESOURCES = [
  '/',
  '/offline',
  '/icons/icon-512.png',
  '/icons/icon-192.png'
];

// Install event - caches predefined assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching pre-defined assets');
        return cache.addAll(PRE_CACHE_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is for an API route
const isApiRequest = (url) => {
  return url.pathname.startsWith('/api/');
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (url) => {
  return url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|json)$/i);
};

// Fetch event strategy: Network first with cache fallback for static assets,
// cache first with network fallback for assets we've already cached,
// and network-only for API requests
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  const requestUrl = new URL(event.request.url);
  
  // For API requests, do not use cache
  if (isApiRequest(requestUrl)) {
    event.respondWith(
      fetch(event.request)
        .catch((error) => {
          console.log('Service Worker: API fetch failed, returning offline response', error);
          
          // Special handling for quotes API - return a fallback quote
          if (requestUrl.pathname === '/api/quotes/random') {
            return new Response(JSON.stringify({
              id: 0,
              text: "Faith is the bird that feels the light when the dawn is still dark.",
              author: "Offline Quote",
              source: "Local Cache",
              category: "offline"
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Return a generic offline error for other API requests
          return new Response(JSON.stringify({ 
            error: 'You are offline. This feature requires an internet connection.' 
          }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
  
  // For static assets and cached content, use cache-first strategy
  if (isStaticAsset(requestUrl) || PRE_CACHE_RESOURCES.includes(requestUrl.pathname)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached response
            return cachedResponse;
          }
          
          // Otherwise try to fetch from network
          return fetch(event.request)
            .then((response) => {
              // Clone the response because we're going to use it twice
              const responseToCache = response.clone();
              
              // Open the cache and store response
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch((error) => {
              console.log('Service Worker: Fetch failed, returning offline page', error);
              
              // For navigation requests, show the offline page
              if (event.request.mode === 'navigate') {
                return caches.match('/offline');
              }
              
              // For other assets, return the default icon as a fallback
              if (requestUrl.pathname.match(/\.(png|jpg|jpeg|svg|ico)$/i)) {
                return caches.match('/icons/icon-192.png');
              }
              
              // Return a 503 error for other types of requests
              return new Response('Service Unavailable', { status: 503 });
            });
        })
    );
    return;
  }
  
  // For all other requests (pages), use network-first strategy
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response because we're going to use it twice
        const responseToCache = response.clone();
        
        // Open the cache and store response for later offline use
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch((error) => {
        console.log('Service Worker: Page fetch failed, checking cache', error);
        
        return caches.match(event.request)
          .then((cachedResponse) => {
            // Return cached page if available
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Otherwise show offline page
            return caches.match('/offline');
          });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'New notification from SpiritualFit',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'SpiritualFit Notification', 
      options
    )
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const url = notification.data.url;
  
  notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // If a tab is already open, focus it
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});