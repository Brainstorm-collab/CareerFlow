// Test script to verify database connection and sample data
import { getSupabaseClient } from './supabase';

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    
    const supabase = getSupabaseClient();
    
    // Test companies table
    console.log('Testing companies table...');
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .limit(5);
    
    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      return false;
    }
    
    console.log(`Found ${companies?.length || 0} companies:`, companies?.map(c => c.name));
    
    // Test jobs table
    console.log('Testing jobs table...');
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies(name)
      `)
      .limit(5);
    
    if (jobsError) {
      console.error('Error fetching jobs:', jobsError);
      return false;
    }
    
    console.log(`Found ${jobs?.length || 0} jobs:`, jobs?.map(j => `${j.title} at ${j.company?.name}`));
    
    console.log('✅ Database connection successful!');
    return true;
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Function to manually insert sample data if needed
export const insertSampleData = async () => {
  try {
    console.log('Inserting sample data...');
    
    const supabase = getSupabaseClient();
    
    // Insert a test company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        name: 'Test Company',
        location: 'Test City, TS',
        description: 'A test company for development purposes'
      })
      .select()
      .single();
    
    if (companyError) {
      console.error('Error inserting company:', companyError);
      return false;
    }
    
    console.log('✅ Sample company inserted:', company);
    
    // Insert a test job
    const { data: job, error: jobError } = await supabase
      .from('jobs')
      .insert({
        title: 'Test Developer',
        company_id: company.id,
        location: 'Test City, TS',
        description: 'A test job posting for development purposes',
        job_type: 'full-time',
        experience_level: 'entry',
        remote_work: true
      })
      .select()
      .single();
    
    if (jobError) {
      console.error('Error inserting job:', jobError);
      return false;
    }
    
    console.log('✅ Sample job inserted:', job);
    return true;
    
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    return false;
  }
};

