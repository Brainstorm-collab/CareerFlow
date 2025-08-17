import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Set' : 'Missing');
}

// Create a single Supabase client instance that will be reused
let supabaseInstance = null;

export const getSupabaseClient = () => {
  // If we already have an instance, return it
  if (supabaseInstance) {
    return supabaseInstance;
  }

  // Validate environment variables before creating client
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are not configured. Please check your .env file.');
  }

  // Create new instance with proper configuration
  supabaseInstance = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
      storage: undefined,
      storageKey: undefined
    },
  });

  return supabaseInstance;
};

// Function to get a Supabase client with JWT token for authenticated requests
export const getAuthenticatedSupabaseClient = async (session) => {
  if (!session) {
    return getSupabaseClient();
  }

  try {
    const token = await session.getToken({ template: "supabase" });
    console.log('Getting JWT token for Supabase:', token ? 'Yes' : 'No', 'Length:', token?.length || 0);
    
    if (!token) {
      console.error('No JWT token received from Clerk');
      return getSupabaseClient();
    }

    // Create a new client instance with the JWT token
    // This creates a temporary instance for authenticated requests
    const authenticatedClient = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
        storage: undefined,
        storageKey: undefined
      }
    });

    return authenticatedClient;
  } catch (error) {
    console.error('Error getting JWT token:', error);
    return getSupabaseClient();
  }
};

// For backward compatibility
export const supabaseClient = getSupabaseClient;

export default getSupabaseClient;
