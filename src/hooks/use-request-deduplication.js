import { useRef, useCallback } from 'react';

// Global request cache to prevent duplicate requests
const requestCache = new Map();
const pendingRequests = new Map();

const useRequestDeduplication = () => {
  const requestIdRef = useRef(0);

  const deduplicatedRequest = useCallback(async (key, requestFn, options = {}) => {
    const {
      cacheTime = 30000, // 30 seconds default cache
      staleTime = 10000, // 10 seconds stale time
    } = options;

    // Check if request is already pending
    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    // Check cache first
    const cached = requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      // Return cached data if not stale
      if (Date.now() - cached.timestamp < staleTime) {
        return cached.data;
      }
      // If stale, return cached data but also fetch fresh data in background
      if (Date.now() - cached.timestamp >= staleTime) {
        // Return stale data immediately
        const staleData = cached.data;
        
        // Fetch fresh data in background
        const freshRequest = requestFn()
          .then(data => {
            requestCache.set(key, {
              data,
              timestamp: Date.now()
            });
            return data;
          })
          .catch(error => {
            console.warn('Background refresh failed:', error);
            return staleData; // Return stale data if refresh fails
          })
          .finally(() => {
            pendingRequests.delete(key);
          });

        pendingRequests.set(key, freshRequest);
        return staleData;
      }
    }

    // Create new request
    const requestId = ++requestIdRef.current;
    const request = requestFn()
      .then(data => {
        requestCache.set(key, {
          data,
          timestamp: Date.now()
        });
        return data;
      })
      .catch(error => {
        // Remove from cache on error
        requestCache.delete(key);
        throw error;
      })
      .finally(() => {
        pendingRequests.delete(key);
      });

    pendingRequests.set(key, request);
    return request;
  }, []);

  const invalidateCache = useCallback((key) => {
    requestCache.delete(key);
  }, []);

  const clearAllCache = useCallback(() => {
    requestCache.clear();
    pendingRequests.clear();
  }, []);

  return {
    deduplicatedRequest,
    invalidateCache,
    clearAllCache
  };
};

export default useRequestDeduplication;
