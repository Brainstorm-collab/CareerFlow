import { useSession } from "@clerk/clerk-react";
import { useState } from "react";
import { getAuthenticatedSupabaseClient } from '../utils/supabase.js';

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const { session } = useSession();

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      // Get authenticated Supabase client with JWT token
      const supabase = await getAuthenticatedSupabaseClient(session);
      const response = await cb(supabase, options, ...args);
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
