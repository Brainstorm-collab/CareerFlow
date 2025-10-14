// Service Worker Registration
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update notification
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Cache management utilities
export const cacheManager = {
  // Clear all caches
  clearAllCaches: async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
  },

  // Get cache size
  getCacheSize: async () => {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      let totalSize = 0;
      
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        totalSize += keys.length;
      }
      
      return totalSize;
    }
    return 0;
  },

  // Preload critical resources
  preloadResources: async (resources) => {
    if ('caches' in window) {
      const cache = await caches.open('careerflow-static-v1');
      await cache.addAll(resources);
    }
  }
};

// Network status monitoring
export const networkMonitor = {
  isOnline: () => navigator.onLine,
  
  onStatusChange: (callback) => {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
};
