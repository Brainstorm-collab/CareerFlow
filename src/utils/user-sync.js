import { getAuthenticatedSupabaseClient } from './supabase.js';

/**
 * Syncs the current Clerk user with Supabase users table
 * This ensures the user exists in Supabase for database operations
 */
export const syncUserToSupabase = async (clerkUser, session) => {
  if (!clerkUser || !session) return null;

  try {
    console.log('Starting user sync for:', clerkUser.primaryEmailAddress?.emailAddress);
    console.log('User object:', clerkUser);
    
    // Get authenticated Supabase client with JWT token
    const supabase = await getAuthenticatedSupabaseClient(session);

    // Check if user already exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUser.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 means "no rows returned" - user doesn't exist
      console.error('Error checking existing user:', fetchError);
      return null;
    }

    if (existingUser) {
      // User exists, update if needed
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({
          email: clerkUser.primaryEmailAddress?.emailAddress,
          first_name: clerkUser.firstName,
          last_name: clerkUser.lastName,
          updated_at: new Date().toISOString(),
          role: clerkUser.unsafeMetadata?.role || 'candidate'
        })
        .eq('clerk_id', clerkUser.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating user:', updateError);
        return null;
      }

      console.log('User updated in Supabase:', updatedUser);
      return updatedUser;
    } else {
      // User doesn't exist, create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          clerk_id: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress,
          first_name: clerkUser.firstName,
          last_name: clerkUser.lastName,
          role: clerkUser.unsafeMetadata?.role || 'candidate',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return null;
      }

      console.log('User created in Supabase:', newUser);
      return newUser;
    }
  } catch (error) {
    console.error('Error syncing user to Supabase:', error);
    return null;
  }
};

/**
 * Hook to automatically sync user when they sign in
 * Use this in components that need user data
 */
export const useUserSync = (clerkUser, session) => {
  const syncUser = async () => {
    if (clerkUser && clerkUser.id && session) {
      return await syncUserToSupabase(clerkUser, session);
    }
    return null;
  };

  return { syncUser };
};
