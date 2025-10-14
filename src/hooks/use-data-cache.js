import { useState, useEffect, useRef } from 'react';

// Simple in-memory cache for frequently accessed data
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useDataCache = (key, fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cached = cache.get(key);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchFn();
        
        // Cache the result
        cache.set(key, {
          data: result,
          timestamp: Date.now()
        });

        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      if (cacheTimeoutRef.current) {
        clearTimeout(cacheTimeoutRef.current);
      }
    };
  }, []);

  const invalidateCache = () => {
    cache.delete(key);
  };

  const clearAllCache = () => {
    cache.clear();
  };

  return { data, loading, error, invalidateCache, clearAllCache };
};

export default useDataCache;
