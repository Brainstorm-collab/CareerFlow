import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const usePrefetch = () => {
  const navigate = useNavigate();
  const prefetchedRoutes = useRef(new Set());
  const prefetchTimeoutRef = useRef(null);

  // Prefetch data for likely next pages
  const prefetchRoute = useCallback(async (route, prefetchFn) => {
    if (prefetchedRoutes.current.has(route)) {
      return; // Already prefetched
    }

    try {
      // Add small delay to not interfere with current page
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await prefetchFn();
      prefetchedRoutes.current.add(route);
    } catch (error) {
      console.warn(`Prefetch failed for ${route}:`, error);
    }
  }, []);

  // Prefetch on hover
  const prefetchOnHover = useCallback((route, prefetchFn) => {
    const timeoutId = setTimeout(() => {
      prefetchRoute(route, prefetchFn);
    }, 200); // 200ms delay on hover

    return () => clearTimeout(timeoutId);
  }, [prefetchRoute]);

  // Prefetch on route change
  const prefetchOnRouteChange = useCallback((currentRoute) => {
    // Clear any existing timeout
    if (prefetchTimeoutRef.current) {
      clearTimeout(prefetchTimeoutRef.current);
    }

    // Prefetch likely next routes after current page loads
    prefetchTimeoutRef.current = setTimeout(() => {
      const prefetchMap = {
        '/': [
          { route: '/saved-jobs', fn: () => import('@/api/apiSavedJobs') },
          { route: '/my-applications', fn: () => import('@/api/apiApplication') },
          { route: '/profile', fn: () => import('@/api/apiUsers') }
        ],
        '/job-listing': [
          { route: '/saved-jobs', fn: () => import('@/api/apiSavedJobs') },
          { route: '/my-applications', fn: () => import('@/api/apiApplication') }
        ],
        '/saved-jobs': [
          { route: '/job-listing', fn: () => import('@/api/apiJobs') },
          { route: '/my-applications', fn: () => import('@/api/apiApplication') }
        ]
      };

      const routesToPrefetch = prefetchMap[currentRoute] || [];
      routesToPrefetch.forEach(({ route, fn }) => {
        prefetchRoute(route, fn);
      });
    }, 1000); // Wait 1 second after route change
  }, [prefetchRoute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (prefetchTimeoutRef.current) {
        clearTimeout(prefetchTimeoutRef.current);
      }
    };
  }, []);

  return {
    prefetchRoute,
    prefetchOnHover,
    prefetchOnRouteChange
  };
};

export default usePrefetch;
