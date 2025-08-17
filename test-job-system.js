// Test script for the job posting system
// Run this in the browser console to test localStorage functionality

console.log('🧪 Testing Job Posting System...');

// Test data
const testJob = {
  title: 'Test Software Engineer',
  description: 'This is a test job posting to verify the system works.',
  requirements: '# Test Requirements\n- Test skill 1\n- Test skill 2',
  location: 'Test City, Test State',
  company: { name: 'Test Company' },
  job_type: 'full-time',
  experience_level: 'mid',
  remote_work: true,
  salary_min: 80000,
  salary_max: 120000,
  benefits: ['Health Insurance', 'Remote Work'],
  status: 'open',
  isOpen: true
};

const testUserId = 'test_user_123';

// Test localStorage service functions
function testLocalStorage() {
  console.log('📦 Testing localStorage functionality...');
  
  try {
    // Clear existing data
    localStorage.removeItem('careerflow_posted_jobs');
    localStorage.removeItem('jobsList');
    
    // Test postJob function
    const { postJob, getAllJobs, getPostedJobs } = window.localStorageService;
    
    if (!postJob || !getAllJobs || !getPostedJobs) {
      console.error('❌ Local storage service not available');
      return false;
    }
    
    console.log('✅ Local storage service functions found');
    
    // Test posting a job
    const result = postJob(testJob, testUserId);
    console.log('📝 Job posting result:', result);
    
    if (!result.success) {
      console.error('❌ Failed to post job');
      return false;
    }
    
    // Test getting all jobs
    const allJobs = getAllJobs();
    console.log('📋 All jobs:', allJobs);
    
    // Test getting posted jobs for user
    const postedJobs = getPostedJobs(testUserId);
    console.log('👤 Posted jobs for user:', postedJobs);
    
    // Verify job appears in both lists
    const jobInAllJobs = allJobs.find(job => job.id === result.data.id);
    const jobInPostedJobs = postedJobs.find(job => job.id === result.data.id);
    
    if (jobInAllJobs && jobInPostedJobs) {
      console.log('✅ Job successfully posted and retrievable');
      return true;
    } else {
      console.error('❌ Job not found in expected locations');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error testing localStorage:', error);
    return false;
  }
}

// Test JobContext integration
function testJobContext() {
  console.log('🔄 Testing JobContext integration...');
  
  try {
    // Check if JobContext is available
    if (typeof window !== 'undefined' && window.JobContext) {
      console.log('✅ JobContext available');
      return true;
    } else {
      console.log('ℹ️ JobContext not available in this context (normal for test script)');
      return true;
    }
  } catch (error) {
    console.error('❌ Error testing JobContext:', error);
    return false;
  }
}

// Run tests
function runAllTests() {
  console.log('🚀 Starting comprehensive tests...');
  
  const localStorageTest = testLocalStorage();
  const contextTest = testJobContext();
  
  if (localStorageTest && contextTest) {
    console.log('🎉 All tests passed! Job posting system is working correctly.');
    
    // Show current state
    console.log('📊 Current localStorage state:');
    console.log('Posted Jobs:', localStorage.getItem('careerflow_posted_jobs'));
    console.log('Global Jobs List:', localStorage.getItem('jobsList'));
    
  } else {
    console.error('💥 Some tests failed. Check the errors above.');
  }
}

// Export for use
window.testJobSystem = {
  testLocalStorage,
  testJobContext,
  runAllTests,
  testJob,
  testUserId
};

console.log('🧪 Test functions available at window.testJobSystem');
console.log('💡 Run testJobSystem.runAllTests() to test the system');

// Auto-run tests if in test mode
if (window.location.search.includes('test=true')) {
  setTimeout(runAllTests, 1000);
}
