// Service Worker for CareerFlow
const CACHE_NAME = 'careerflow-v1';
const STATIC_CACHE = 'careerflow-static-v1';
const DYNAMIC_CACHE = 'careerflow-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/companies/default.svg',
  '/companies/google.webp',
  '/companies/microsoft.webp',
  '/companies/amazon.svg',
  '/companies/meta.svg',
  '/companies/netflix.png',
  '/companies/uber.svg',
  '/companies/atlassian.svg',
  '/companies/ibm.svg',
  '/companies/apple.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/convex/')) {
    // API requests - network first, then cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response for caching
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request);
        })
    );
  } else if (url.pathname.startsWith('/companies/') || url.pathname.endsWith('.svg') || url.pathname.endsWith('.webp') || url.pathname.endsWith('.png')) {
    // Static assets - cache first
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
              return response;
            });
        })
    );
  } else {
    // HTML pages - network first, then cache
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              cache.put(request, responseClone);
            });
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              // Fallback to index.html for SPA routing
              return caches.match('/');
            });
        })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline actions when back online
      handleBackgroundSync()
    );
  }
});

async function handleBackgroundSync() {
  // Get offline actions from IndexedDB and sync them
  console.log('Handling background sync');
  // Implementation would depend on your offline storage strategy
}

// Push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/companies/default.svg',
      badge: '/companies/default.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey
      },
      actions: [
        {
          action: 'explore',
          title: 'View Job',
          icon: '/companies/default.svg'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/companies/default.svg'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/job-listing')
    );
  }
});
