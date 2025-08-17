/**
 * Local Storage Service for CareerFlow
 * This provides a working alternative to Supabase while you set up the database
 * All data is stored locally in the browser
 */

const STORAGE_KEYS = {
  SAVED_JOBS: 'careerflow_saved_jobs',
  POSTED_JOBS: 'careerflow_posted_jobs',
  USER_DATA: 'careerflow_user_data',
  APPLICATIONS: 'careerflow_applications',
  JOB_APPLICANTS: 'careerflow_job_applicants'
};

/**
 * Get saved jobs for a specific user
 */
export const getSavedJobs = (userId) => {
  try {
    const savedJobs = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    if (!savedJobs) return [];
    
    const allSavedJobs = JSON.parse(savedJobs);
    return allSavedJobs.filter(job => job.user_id === userId);
  } catch (error) {
    console.error('Error getting saved jobs:', error);
    return [];
  }
};

/**
 * Save a job for a user
 */
export const saveJob = (userId, jobId) => {
  try {
    const savedJobs = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    const allSavedJobs = savedJobs ? JSON.parse(savedJobs) : [];
    
    // Check if job is already saved
    const alreadySaved = allSavedJobs.find(
      job => job.user_id === userId && job.job_id === jobId
    );
    
    if (alreadySaved) {
      return { success: false, message: 'Job already saved' };
    }
    
    // Add new saved job
    const newSavedJob = {
      id: `saved_${Date.now()}_${Math.random()}`,
      user_id: userId,
      job_id: jobId,
      created_at: new Date().toISOString()
    };
    
    allSavedJobs.push(newSavedJob);
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(allSavedJobs));
    
    return { success: true, data: newSavedJob };
  } catch (error) {
    console.error('Error saving job:', error);
    return { success: false, message: 'Failed to save job' };
  }
};

/**
 * Remove a saved job
 */
export const removeSavedJob = (userId, jobId) => {
  try {
    const savedJobs = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    if (!savedJobs) return { success: false, message: 'No saved jobs found' };
    
    const allSavedJobs = JSON.parse(savedJobs);
    const filteredJobs = allSavedJobs.filter(
      job => !(job.user_id === userId && job.job_id === jobId)
    );
    
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(filteredJobs));
    
    return { success: true, message: 'Job removed from saved jobs' };
  } catch (error) {
    console.error('Error removing saved job:', error);
    return { success: false, message: 'Failed to remove saved job' };
  }
};

/**
 * Check if a job is saved by a user
 */
export const isJobSaved = (userId, jobId) => {
  try {
    const savedJobs = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    if (!savedJobs) return false;
    
    const allSavedJobs = JSON.parse(savedJobs);
    return allSavedJobs.some(
      job => job.user_id === userId && job.job_id === jobId
    );
  } catch (error) {
    console.error('Error checking if job is saved:', error);
    return false;
  }
};

/**
 * Get posted jobs for a specific user (recruiter)
 */
export const getPostedJobs = (userId) => {
  try {
    const postedJobs = localStorage.getItem(STORAGE_KEYS.POSTED_JOBS);
    if (!postedJobs) return [];
    
    const allPostedJobs = JSON.parse(postedJobs);
    return allPostedJobs.filter(job => job.recruiter_id === userId);
  } catch (error) {
    console.error('Error getting posted jobs:', error);
    return [];
  }
};

/**
 * Post a new job
 */
export const postJob = (jobData, userId) => {
  try {
    const postedJobs = localStorage.getItem(STORAGE_KEYS.POSTED_JOBS);
    const allPostedJobs = postedJobs ? JSON.parse(postedJobs) : [];
    
    const newJob = {
      id: `job_${Date.now()}_${Math.random()}`,
      ...jobData,
      recruiter_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isOpen: jobData.isOpen !== false // Default to true if not specified
    };
    
    allPostedJobs.push(newJob);
    localStorage.setItem(STORAGE_KEYS.POSTED_JOBS, JSON.stringify(allPostedJobs));
    
    // Also add to the global jobs list for immediate visibility
    const globalJobs = localStorage.getItem('jobsList');
    const allGlobalJobs = globalJobs ? JSON.parse(globalJobs) : [];
    allGlobalJobs.unshift(newJob); // Add to beginning
    localStorage.setItem('jobsList', JSON.stringify(allGlobalJobs));
    
    return { success: true, data: newJob };
  } catch (error) {
    console.error('Error posting job:', error);
    return { success: false, message: 'Failed to post job' };
  }
};

/**
 * Update a posted job
 */
export const updatePostedJob = (jobId, updates, userId) => {
  try {
    const postedJobs = localStorage.getItem(STORAGE_KEYS.POSTED_JOBS);
    if (!postedJobs) return { success: false, message: 'No posted jobs found' };
    
    const allPostedJobs = JSON.parse(postedJobs);
    const jobIndex = allPostedJobs.findIndex(
      job => job.id === jobId && job.recruiter_id === userId
    );
    
    if (jobIndex === -1) {
      return { success: false, message: 'Job not found or not authorized' };
    }
    
    allPostedJobs[jobIndex] = {
      ...allPostedJobs[jobIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.POSTED_JOBS, JSON.stringify(allPostedJobs));
    
    return { success: true, data: allPostedJobs[jobIndex] };
  } catch (error) {
    console.error('Error updating posted job:', error);
    return { success: false, message: 'Failed to update job' };
  }
};

/**
 * Delete a posted job
 */
export const deletePostedJob = (jobId, userId) => {
  try {
    // Remove from posted jobs
    const postedJobs = localStorage.getItem(STORAGE_KEYS.POSTED_JOBS);
    if (!postedJobs) return { success: false, message: 'No posted jobs found' };
    
    const allPostedJobs = JSON.parse(postedJobs);
    const filteredPostedJobs = allPostedJobs.filter(
      job => !(job.id === jobId && job.recruiter_id === userId)
    );
    
    localStorage.setItem(STORAGE_KEYS.POSTED_JOBS, JSON.stringify(filteredPostedJobs));
    
    // Also remove from global jobs list
    const globalJobs = localStorage.getItem('jobsList');
    if (globalJobs) {
      const allGlobalJobs = JSON.parse(globalJobs);
      const filteredGlobalJobs = allGlobalJobs.filter(
        job => !(job.id === jobId && job.recruiter_id === userId)
      );
      localStorage.setItem('jobsList', JSON.stringify(filteredGlobalJobs));
    }
    
    return { success: true, message: 'Job deleted successfully' };
  } catch (error) {
    console.error('Error deleting posted job:', error);
    return { success: false, message: 'Failed to delete job' };
  }
};

/**
 * Get applications for a specific user
 */
export const getUserApplications = (userId) => {
  try {
    const applications = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!applications) return [];
    
    const allApplications = JSON.parse(applications);
    return allApplications.filter(app => app.user_id === userId);
  } catch (error) {
    console.error('Error getting user applications:', error);
    return [];
  }
};

/**
 * Submit a job application
 */
export const submitApplication = (applicationData, userId) => {
  try {
    const applications = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    const allApplications = applications ? JSON.parse(applications) : [];
    
    // Check if user already applied to this job
    const alreadyApplied = allApplications.find(
      app => app.user_id === userId && app.job_id === applicationData.job_id
    );
    
    if (alreadyApplied) {
      return { success: false, message: 'You have already applied to this job' };
    }
    
    const newApplication = {
      id: `app_${Date.now()}_${Math.random()}`,
      ...applicationData,
      user_id: userId,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    allApplications.push(newApplication);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(allApplications));
    
    // Update job applicants count
    updateJobApplicantsCount(applicationData.job_id, 1);
    
    return { success: true, data: newApplication };
  } catch (error) {
    console.error('Error submitting application:', error);
    return { success: false, message: 'Failed to submit application' };
  }
};

/**
 * Get applications for a specific job (for recruiters)
 */
export const getJobApplications = (jobId, recruiterId) => {
  try {
    const applications = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!applications) return [];
    
    const allApplications = JSON.parse(applications);
    return allApplications.filter(app => app.job_id === jobId);
  } catch (error) {
    console.error('Error getting job applications:', error);
    return [];
  }
};

/**
 * Update application status
 */
export const updateApplicationStatus = (applicationId, status, userId) => {
  try {
    const applications = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (!applications) return { success: false, message: 'No applications found' };
    
    const allApplications = JSON.parse(applications);
    const appIndex = allApplications.findIndex(app => app.id === applicationId);
    
    if (appIndex === -1) {
      return { success: false, message: 'Application not found' };
    }
    
    allApplications[appIndex].status = status;
    allApplications[appIndex].updated_at = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(allApplications));
    
    return { success: true, data: allApplications[appIndex] };
  } catch (error) {
    console.error('Error updating application status:', error);
    return { success: false, message: 'Failed to update application status' };
  }
};

/**
 * Get applicant count for a specific job
 */
export const getJobApplicantsCount = (jobId) => {
  try {
    const applicants = localStorage.getItem(STORAGE_KEYS.JOB_APPLICANTS);
    if (!applicants) return 0;
    
    const allApplicants = JSON.parse(applicants);
    const jobApplicants = allApplicants[jobId];
    return jobApplicants ? jobApplicants.count : 0;
  } catch (error) {
    console.error('Error getting job applicants count:', error);
    return 0;
  }
};

/**
 * Update job applicants count
 */
export const updateJobApplicantsCount = (jobId, increment = 1) => {
  try {
    const applicants = localStorage.getItem(STORAGE_KEYS.JOB_APPLICANTS);
    const allApplicants = applicants ? JSON.parse(applicants) : {};
    
    if (!allApplicants[jobId]) {
      allApplicants[jobId] = { count: 0, last_updated: new Date().toISOString() };
    }
    
    allApplicants[jobId].count = Math.max(0, allApplicants[jobId].count + increment);
    allApplicants[jobId].last_updated = new Date().toISOString();
    
    localStorage.setItem(STORAGE_KEYS.JOB_APPLICANTS, JSON.stringify(allApplicants));
    
    return { success: true, count: allApplicants[jobId].count };
  } catch (error) {
    console.error('Error updating job applicants count:', error);
    return { success: false, count: 0 };
  }
};

/**
 * Get all jobs (posted + sample jobs)
 */
export const getAllJobs = () => {
  try {
    const postedJobs = localStorage.getItem(STORAGE_KEYS.POSTED_JOBS);
    const allPostedJobs = postedJobs ? JSON.parse(postedJobs) : [];
    
    // Sample jobs for demonstration
    const sampleJobs = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        title: 'Senior Software Engineer',
        description: 'We are looking for a Senior Software Engineer to join our team and help build scalable web applications. You will work on cutting-edge technologies and collaborate with cross-functional teams.',
        requirements: [
          '5+ years of experience in software development',
          'Strong knowledge of JavaScript, Python, or Java',
          'Experience with cloud platforms (AWS, GCP, or Azure)',
          'Knowledge of microservices architecture',
          'Excellent problem-solving and communication skills',
          'Experience with CI/CD pipelines and DevOps practices'
        ],
        location: 'San Francisco, CA',
        salary_min: 120000,
        salary_max: 180000,
        job_type: 'full-time',
        experience_level: 'senior',
        remote_work: true,
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours', 'Professional Development'],
        company: { name: 'Google' },
        created_at: '2024-01-01T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_1'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        title: 'Frontend Developer',
        description: 'Join our frontend team to create beautiful and responsive user interfaces. You will work with modern frameworks and ensure excellent user experience across all devices.',
        requirements: [
          '3+ years of experience in frontend development',
          'Proficiency in React, Vue.js, or Angular',
          'Strong CSS and HTML skills with responsive design',
          'Experience with modern JavaScript (ES6+) and TypeScript',
          'Knowledge of state management (Redux, Vuex, or similar)',
          'Experience with testing frameworks (Jest, Cypress)'
        ],
        location: 'New York, NY',
        salary_min: 80000,
        salary_max: 120000,
        job_type: 'full-time',
        experience_level: 'mid',
        remote_work: false,
        benefits: ['Health Insurance', 'Dental Coverage', 'Vision Coverage', 'Paid Time Off'],
        company: { name: 'Microsoft' },
        created_at: '2024-01-02T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_2'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440003',
        title: 'Data Scientist',
        description: 'We are seeking a Data Scientist to analyze complex data sets and develop machine learning models. You will work on predictive analytics and help drive business decisions.',
        requirements: [
          '3+ years of experience in data science or analytics',
          'Strong Python programming skills with data science libraries',
          'Experience with machine learning (scikit-learn, TensorFlow, PyTorch)',
          'Proficiency in SQL and data manipulation',
          'Knowledge of statistical analysis and A/B testing',
          'Advanced degree in Statistics, Mathematics, Computer Science, or related field'
        ],
        location: 'Seattle, WA',
        salary_min: 100000,
        salary_max: 150000,
        job_type: 'full-time',
        experience_level: 'mid',
        remote_work: true,
        benefits: ['Health Insurance', '401k', 'Stock Options', 'Remote Work', 'Conference Budget'],
        company: { name: 'Amazon' },
        created_at: '2024-01-03T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_3'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440004',
        title: 'Product Manager',
        description: 'Lead product strategy and execution for our flagship platform. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.',
        requirements: [
          '5+ years of product management experience',
          'Strong analytical and strategic thinking skills',
          'Experience with user research and data analysis',
          'Excellent communication and stakeholder management',
          'Knowledge of agile methodologies and product development',
          'Technical background or experience working with engineering teams'
        ],
        location: 'Austin, TX',
        salary_min: 110000,
        salary_max: 160000,
        job_type: 'full-time',
        experience_level: 'senior',
        remote_work: true,
        benefits: ['Health Insurance', '401k', 'Stock Options', 'Remote Work', 'Professional Development'],
        company: { name: 'Netflix' },
        created_at: '2024-01-04T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_4'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440005',
        title: 'DevOps Engineer',
        description: 'Build and maintain our cloud infrastructure and CI/CD pipelines. You will ensure high availability, security, and performance of our systems.',
        location: 'Remote',
        salary_min: 90000,
        salary_max: 140000,
        job_type: 'full-time',
        experience_level: 'mid',
        remote_work: true,
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours', 'Conference Budget'],
        company: { name: 'Uber' },
        created_at: '2024-01-05T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_5'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440006',
        title: 'UX Designer',
        description: 'Create intuitive and beautiful user experiences for our products. You will conduct user research, create wireframes, and collaborate with development teams.',
        location: 'Los Angeles, CA',
        salary_min: 85000,
        salary_max: 130000,
        job_type: 'full-time',
        experience_level: 'mid',
        remote_work: false,
        benefits: ['Health Insurance', 'Dental Coverage', 'Vision Coverage', 'Paid Time Off', 'Professional Development'],
        company: { name: 'Meta' },
        created_at: '2024-01-06T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_6'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440007',
        title: 'Backend Developer',
        description: 'Develop robust and scalable backend services using modern technologies. You will work on API development, database design, and system architecture.',
        location: 'Chicago, IL',
        salary_min: 95000,
        salary_max: 145000,
        job_type: 'full-time',
        experience_level: 'mid',
        remote_work: true,
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours', 'Professional Development'],
        company: { name: 'IBM' },
        created_at: '2024-01-07T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_7'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440008',
        title: 'Mobile App Developer',
        description: 'Build native mobile applications for iOS and Android platforms. You will work with cutting-edge mobile technologies and ensure excellent app performance.',
        location: 'Miami, FL',
        salary_min: 80000,
        salary_max: 125000,
        job_type: 'full-time',
        experience_level: 'mid',
        remote_work: false,
        benefits: ['Health Insurance', 'Dental Coverage', 'Vision Coverage', 'Paid Time Off', 'Professional Development'],
        company: { name: 'Atlassian' },
        created_at: '2024-01-08T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_8'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440009',
        title: 'Machine Learning Engineer',
        description: 'Develop and deploy machine learning models for production use. You will work on data preprocessing, model training, and MLOps infrastructure.',
        location: 'Boston, MA',
        salary_min: 100000,
        salary_max: 160000,
        job_type: 'full-time',
        experience_level: 'senior',
        remote_work: true,
        benefits: ['Health Insurance', '401k', 'Stock Options', 'Remote Work', 'Conference Budget'],
        company: { name: 'Google' },
        created_at: '2024-01-09T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_9'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440010',
        title: 'Full Stack Developer',
        description: 'Build end-to-end web applications using modern frameworks. You will work on both frontend and backend development with a focus on user experience.',
        location: 'Denver, CO',
        salary_min: 75000,
        salary_max: 115000,
        job_type: 'full-time',
        experience_level: 'entry',
        remote_work: true,
        benefits: ['Health Insurance', '401k', 'Remote Work', 'Flexible Hours', 'Professional Development'],
        company: { name: 'Microsoft' },
        created_at: '2024-01-10T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_10'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440011',
        title: 'Cloud Architect',
        description: 'Design and implement cloud infrastructure solutions for enterprise clients. You will work on migration strategies, security, and cost optimization.',
        location: 'Phoenix, AZ',
        salary_min: 120000,
        salary_max: 180000,
        job_type: 'full-time',
        experience_level: 'senior',
        remote_work: true,
        benefits: ['Health Insurance', '401k', 'Stock Options', 'Remote Work', 'Professional Development'],
        company: { name: 'Amazon' },
        created_at: '2024-01-11T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_11'
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440012',
        title: 'Cybersecurity Analyst',
        description: 'Protect our systems and data from cyber threats. You will conduct security assessments, monitor for threats, and implement security measures.',
        location: 'Washington, DC',
        salary_min: 90000,
        salary_max: 140000,
        job_type: 'full-time',
        experience_level: 'mid',
        remote_work: false,
        benefits: ['Health Insurance', 'Dental Coverage', 'Vision Coverage', 'Paid Time Off', 'Professional Development'],
        company: { name: 'Meta' },
        created_at: '2024-01-12T00:00:00.000Z',
        isOpen: true,
        recruiter_id: 'sample_recruiter_12'
      }
    ];
    
    // Combine posted jobs with sample jobs, ensuring posted jobs appear first
    const allJobs = [...allPostedJobs, ...sampleJobs];
    
    // Sort by creation date (newest first)
    allJobs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Add applicant counts to each job
    return allJobs.map(job => ({
      ...job,
      applicantsCount: getJobApplicantsCount(job.id)
    }));
  } catch (error) {
    console.error('Error getting all jobs:', error);
    return [];
  }
};

/**
 * Clear all local storage data (useful for testing)
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return { success: true, message: 'All data cleared' };
  } catch (error) {
    console.error('Error clearing data:', error);
    return { success: false, message: 'Failed to clear data' };
  }
};

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
  try {
    const stats = {};
    Object.entries(STORAGE_KEYS).forEach(([key, storageKey]) => {
      const data = localStorage.getItem(storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        if (key === 'JOB_APPLICANTS') {
          stats[key] = Object.keys(parsed).length;
        } else {
          stats[key] = Array.isArray(parsed) ? parsed.length : 1;
        }
      } else {
        stats[key] = 0;
      }
    });
    return stats;
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return {};
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.localStorageService = {
    getSavedJobs,
    saveJob,
    removeSavedJob,
    isJobSaved,
    getPostedJobs,
    postJob,
    updatePostedJob,
    deletePostedJob,
    getUserApplications,
    submitApplication,
    getJobApplications,
    updateApplicationStatus,
    getJobApplicantsCount,
    updateJobApplicantsCount,
    getAllJobs,
    clearAllData,
    getStorageStats
  };
}
