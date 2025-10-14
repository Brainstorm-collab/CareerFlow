import { useAuth } from "../context/AuthContext";
import { useState } from "react";
// import { getAuthenticatedSupabaseClient } from '../utils/supabase.js'; // Removed - will use Convex

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement with Convex
      console.log('useFetch called - will implement with Convex');
      const response = await cb(null, options, ...args); // Pass null for now
      setData(response);
      setError(null);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
