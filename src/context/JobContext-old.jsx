import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useGetSavedJobs, useGetApplicationsByCandidate } from '@/api/apiSavedJobs';
import { useGetApplicationsByCandidate as useGetApplications } from '@/api/apiApplication';

const JobContext = createContext();

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const { user, isSignedIn } = useAuth();
  const [jobsList, setJobsList] = useState([]);
  
  // Use Convex hooks for real-time data
  const savedJobs = useGetSavedJobs(user?.id);
  const applications = useGetApplications(user?.id);

  // Helper function to get database user ID
  const getDatabaseUserId = async (userId) => {
    if (!userId) return null;
    
    try {
      // TODO: Implement with Convex
      console.log('getDatabaseUserId called - will implement with Convex');
      console.log('User ID:', userId);
      return userId; // For now, just return the user ID
    } catch (error) {
      console.error('Error in getDatabaseUserId:', error);
      return null;
    }
  };

  // Load data from database and localStorage on mount and when user changes
  useEffect(() => {
    if (isSignedIn && user) {
      // First get the database user ID
      getDatabaseUserId(user.id).then((userId) => {
        if (userId) {
          setDatabaseUserId(userId);
          loadUserDataFromDatabase(userId);
        }
      });
      
      // Also load from localStorage as fallback
      const jobsListData = localStorage.getItem('jobsList');
      if (jobsListData) {
        try {
          setJobsList(JSON.parse(jobsListData));
        } catch (error) {
          console.error('Error parsing jobs list:', error);
          setJobsList([]);
        }
      }
    } else if (!isSignedIn) {
      // Clear data when user is not signed in
      setSavedJobs([]);
      setAppliedJobs([]);
      setDatabaseUserId(null);
    }
  }, [isSignedIn, user]);

  // Function to load user data from database
  const loadUserDataFromDatabase = async (userId) => {
    if (!userId) return;
    
    try {
      const supabase = getSupabaseClient();
      
      // Load saved jobs
      const { data: savedJobsData, error: savedJobsError } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          job: jobs(
            id,
            title,
            company: companies(name, logo_url),
            location,
            job_type,
            experience_level,
            salary_min,
            salary_max
          )
        `)
        .eq('user_id', userId);
      
      if (savedJobsError) {
        console.error('Error loading saved jobs:', savedJobsError);
      } else {
        console.log('Loaded saved jobs from Supabase:', savedJobsData);
        const savedJobsWithData = savedJobsData?.map(item => item.job).filter(Boolean) || [];
        setSavedJobs(savedJobsWithData);
      }
      
      // Load applied jobs
      const { data: appliedJobsData, error: appliedJobsError } = await supabase
        .from('applications')
        .select(`
          *,
          job: jobs(
            id,
            title,
            company: companies(name, logo_url),
            location,
            job_type,
            experience_level,
            salary_min,
            salary_max
          )
        `)
        .eq('candidate_id', userId);
      
      if (appliedJobsError) {
        console.error('Error loading applied jobs:', appliedJobsError);
      } else {
        console.log('Loaded applied jobs from Supabase:', appliedJobsData);
        const appliedJobsWithData = appliedJobsData?.map(item => item.job).filter(Boolean) || [];
        setAppliedJobs(appliedJobsWithData);
      }
    } catch (error) {
      console.error('Error loading user data from Supabase:', error);
    }
  };

  // Load posted jobs from localStorage and merge with jobsList
  useEffect(() => {
    try {
      const postedJobsData = localStorage.getItem('careerflow_posted_jobs');
      if (postedJobsData) {
        const postedJobs = JSON.parse(postedJobsData);
        // Merge posted jobs with existing jobsList, avoiding duplicates
        setJobsList(prev => {
          const existingIds = new Set(prev.map(job => job.id));
          const newPostedJobs = postedJobs.filter(job => !existingIds.has(job.id));
          return [...newPostedJobs, ...prev];
        });
      }
    } catch (error) {
      console.error('Error loading posted jobs:', error);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isSignedIn && user) {
      try {
        localStorage.setItem(`savedJobs_${user.id}`, JSON.stringify(savedJobs));
        localStorage.setItem(`appliedJobs_${user.id}`, JSON.stringify(appliedJobs));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [savedJobs, appliedJobs, isSignedIn, user]);

  useEffect(() => {
    try {
      localStorage.setItem('jobsList', JSON.stringify(jobsList));
    } catch (error) {
      console.error('Error saving jobs list to localStorage:', error);
    }
  }, [jobsList]);

  const saveJob = async (jobId, jobData = null) => {
    if (!user || !supabaseUserId) return;
    
    try {
      const supabase = getSupabaseClient();
      
      // Check if job is already saved
      const { data: existingSavedJob, error: checkError } = await supabase
        .from('saved_jobs')
        .select('*')
        .eq('user_id', supabaseUserId)
        .eq('job_id', jobId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking saved job:', checkError);
        return;
      }
      
      if (existingSavedJob) {
        // Remove if already saved (toggle behavior)
        console.log('Removing saved job:', jobId);
        const { error: deleteError } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', supabaseUserId)
          .eq('job_id', jobId);
        
        if (deleteError) {
          console.error('Error removing saved job:', deleteError);
          return;
        }
        
        // Update local state
        setSavedJobs(prev => prev.filter(job => job.id !== jobId));
      } else {
        // Add new saved job
        console.log('Adding new saved job:', jobId);
        const { error: insertError } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: jobId
          });
        
        if (insertError) {
          console.error('Error saving job:', insertError);
          return;
        }
        
        // Update local state
        const jobToSave = jobData || { id: jobId };
        setSavedJobs(prev => [...prev, jobToSave]);
      }
    } catch (error) {
      console.error('Error in saveJob:', error);
    }
  };

  const removeSavedJob = (jobId) => {
    if (!user) return;
    
    console.log('Removing saved job:', jobId);
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const applyToJob = async (jobId, jobData = null) => {
    if (!user || !supabaseUserId) return;
    
    try {
      const supabase = getSupabaseClient();
      
      // Check if already applied
      const { data: existingApplication, error: checkError } = await supabase
        .from('applications')
        .select('*')
        .eq('candidate_id', supabaseUserId)
        .eq('job_id', jobId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking application:', checkError);
        return;
      }
      
      if (!existingApplication) {
        // Add new application to local state for immediate UI update
        let jobToApply = jobData;
        
        // If no jobData provided, try to find it in jobsList
        if (!jobToApply) {
          jobToApply = jobsList.find(job => job.id === jobId);
        }
        
        // If still no job data, create a minimal object
        if (!jobToApply) {
          jobToApply = { id: jobId };
        }
        
        console.log('Adding new application to local state:', jobToApply);
        setAppliedJobs(prev => {
          // Check if already in the list to avoid duplicates
          const exists = prev.some(job => job.id === jobId);
          if (!exists) {
            return [...prev, jobToApply];
          }
          return prev;
        });
      } else {
        console.log('Already applied to job:', jobId);
      }
    } catch (error) {
      console.error('Error in applyToJob:', error);
    }
  };

  const addNewJob = (job) => {
    console.log('Adding new job to context:', job);
    setJobsList(prev => {
      // Check if job already exists
      const exists = prev.some(existingJob => existingJob.id === job.id);
      if (!exists) {
        const updatedList = [job, ...prev];
        console.log('Updated jobs list:', updatedList);
        // Also save to localStorage for persistence
        try {
          localStorage.setItem('jobsList', JSON.stringify(updatedList));
          console.log('Saved to localStorage');
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        return updatedList;
      }
      console.log('Job already exists in context');
      return prev;
    });
  };

  const isJobSaved = (jobId) => {
    // Check both local state and Supabase
    const localSaved = savedJobs.some(job => job.id === jobId);
    return localSaved;
  };

  const isJobApplied = (jobId) => {
    // Check local state for immediate UI updates
    const localApplied = appliedJobs.some(job => job.id === jobId);
    return localApplied;
  };

  const getSavedJobsData = () => {
    // Return saved jobs with full data if available, otherwise filter from jobsList
    const savedJobsWithData = savedJobs.filter(job => job.title && job.company);
    
    console.log('Getting saved jobs data:', {
      savedJobs,
      savedJobsWithData,
      jobsList: jobsList.length,
      hasFullData: savedJobsWithData.length === savedJobs.length
    });
    
    if (savedJobsWithData.length === savedJobs.length) {
      return savedJobsWithData;
    }
    
    // Fallback: get data from jobsList for saved job IDs
    const fallbackData = jobsList.filter(job => savedJobs.some(savedJob => savedJob.id === job.id));
    console.log('Using fallback data for saved jobs:', fallbackData);
    return fallbackData;
  };

  const getAppliedJobsData = () => {
    // Return applied jobs with full data if available, otherwise filter from jobsList
    const appliedJobsWithData = appliedJobs.filter(job => job.title && job.company);
    
    console.log('Getting applied jobs data:', {
      appliedJobs,
      appliedJobsWithData,
      jobsList: jobsList.length,
      hasFullData: appliedJobsWithData.length === appliedJobs.length
    });
    
    if (appliedJobsWithData.length === appliedJobs.length) {
      return appliedJobsWithData;
    }
    
    // Fallback: get data from jobsList for applied job IDs
    const fallbackData = jobsList.filter(job => appliedJobs.some(appliedJob => appliedJob.id === job.id));
    console.log('Using fallback data for applied jobs:', fallbackData);
    return fallbackData;
  };

  const clearUserData = () => {
    setSavedJobs([]);
    setAppliedJobs([]);
  };

  const value = {
    savedJobs,
    appliedJobs,
    jobsList,
    saveJob,
    removeSavedJob,
    applyToJob,
    addNewJob,
    isJobSaved,
    isJobApplied,
    getSavedJobsData,
    getAppliedJobsData,
    clearUserData,
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};
