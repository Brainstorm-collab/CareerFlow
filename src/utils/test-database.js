import { getSupabaseClient, getAuthenticatedSupabaseClient } from './supabase.js';

/**
 * Test database connectivity and RLS policies
 * Run this in the browser console to debug database issues
 */
export const testDatabaseConnection = async (session) => {
  console.log('🧪 Testing Database Connection...');
  
  try {
    // Test 1: Basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const supabase = getSupabaseClient();
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(1);
    
    if (companiesError) {
      console.error('❌ Companies table error:', companiesError);
    } else {
      console.log('✅ Companies table accessible:', companies?.length || 0, 'companies found');
    }

    // Test 2: Jobs table
    console.log('\n2️⃣ Testing jobs table...');
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .limit(1);
    
    if (jobsError) {
      console.error('❌ Jobs table error:', jobsError);
    } else {
      console.log('✅ Jobs table accessible:', jobs?.length || 0, 'jobs found');
    }

    // Test 3: Authenticated access (if session exists)
    if (session) {
      console.log('\n3️⃣ Testing authenticated access...');
      const authSupabase = await getAuthenticatedSupabaseClient(session);
      
      // Test saved_jobs table
      const { data: savedJobs, error: savedJobsError } = await authSupabase
        .from('saved_jobs')
        .select('*')
        .limit(1);
      
      if (savedJobsError) {
        console.error('❌ Saved jobs table error:', savedJobsError);
      } else {
        console.log('✅ Saved jobs table accessible:', savedJobs?.length || 0, 'saved jobs found');
      }

      // Test applications table
      const { data: applications, error: applicationsError } = await authSupabase
        .from('applications')
        .select('*')
        .limit(1);
      
      if (applicationsError) {
        console.error('❌ Applications table error:', applicationsError);
      } else {
        console.log('✅ Applications table accessible:', applications?.length || 0, 'applications found');
      }

      // Test users table
      const { data: users, error: usersError } = await authSupabase
        .from('users')
        .select('*')
        .limit(1);
      
      if (usersError) {
        console.error('❌ Users table error:', usersError);
      } else {
        console.log('✅ Users table accessible:', users?.length || 0, 'users found');
      }
    } else {
      console.log('\n3️⃣ Skipping authenticated tests (no session)');
    }

    console.log('\n🎉 Database connection test completed!');
    
  } catch (error) {
    console.error('💥 Database test failed:', error);
  }
};

/**
 * Test specific table access
 */
export const testTableAccess = async (tableName, session) => {
  console.log(`🧪 Testing ${tableName} table access...`);
  
  try {
    const supabase = session ? 
      await getAuthenticatedSupabaseClient(session) : 
      getSupabaseClient();
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(5);
    
    if (error) {
      console.error(`❌ ${tableName} table error:`, error);
      return false;
    } else {
      console.log(`✅ ${tableName} table accessible:`, data?.length || 0, 'records found');
      return true;
    }
  } catch (error) {
    console.error(`💥 ${tableName} table test failed:`, error);
    return false;
  }
};

/**
 * Test user creation and sync
 */
export const testUserSync = async (clerkUser, session) => {
  console.log('🧪 Testing user sync...');
  
  try {
    const supabase = await getAuthenticatedSupabaseClient(session);
    
    // Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', clerkUser.id)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('❌ Error checking user:', fetchError);
      return false;
    }
    
    if (existingUser) {
      console.log('✅ User exists in database:', existingUser);
      return true;
    } else {
      console.log('⚠️ User not found in database, sync may be needed');
      return false;
    }
  } catch (error) {
    console.error('💥 User sync test failed:', error);
    return false;
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testDatabaseConnection = testDatabaseConnection;
  window.testTableAccess = testTableAccess;
  window.testUserSync = testUserSync;
}
