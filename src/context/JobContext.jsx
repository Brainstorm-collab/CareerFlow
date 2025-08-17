import { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

const JobContext = createContext();

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};

export const JobProvider = ({ children }) => {
  const { user, isSignedIn } = useUser();
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobsList, setJobsList] = useState([]);

  // Load data from localStorage on mount and when user changes
  useEffect(() => {
    if (isSignedIn && user) {
      // Load user-specific data
      const savedJobsData = localStorage.getItem(`savedJobs_${user.id}`);
      const appliedJobsData = localStorage.getItem(`appliedJobs_${user.id}`);
      const jobsListData = localStorage.getItem('jobsList');

      if (savedJobsData) {
        try {
          setSavedJobs(JSON.parse(savedJobsData));
        } catch (error) {
          console.error('Error parsing saved jobs:', error);
          setSavedJobs([]);
        }
      }
      if (appliedJobsData) {
        try {
          setAppliedJobs(JSON.parse(appliedJobsData));
        } catch (error) {
          console.error('Error parsing applied jobs:', error);
          setAppliedJobs([]);
        }
      }
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
    }
  }, [isSignedIn, user]);

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

  const saveJob = (jobId, jobData = null) => {
    if (!user) return;
    
    // If we have full job data, store it; otherwise just store the ID
    const jobToSave = jobData || { id: jobId };
    
    console.log('Saving job:', { jobId, jobData: jobToSave, user: user.id });
    
    setSavedJobs(prev => {
      // Check if job is already saved
      const isAlreadySaved = prev.some(job => job.id === jobId);
      
      if (isAlreadySaved) {
        // Remove if already saved (toggle behavior)
        console.log('Removing saved job:', jobId);
        return prev.filter(job => job.id !== jobId);
      } else {
        // Add new saved job
        console.log('Adding new saved job:', jobToSave);
        return [...prev, jobToSave];
      }
    });
  };

  const removeSavedJob = (jobId) => {
    if (!user) return;
    
    console.log('Removing saved job:', jobId);
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));
  };

  const applyToJob = (jobId, jobData = null) => {
    if (!user) return;
    
    // If we have full job data, store it; otherwise just store the ID
    const jobToApply = jobData || { id: jobId };
    
    console.log('Applying to job:', { jobId, jobData: jobToApply, user: user.id });
    
    setAppliedJobs(prev => {
      // Check if already applied
      const isAlreadyApplied = prev.some(job => job.id === jobId);
      
      if (!isAlreadyApplied) {
        // Add new application
        console.log('Adding new application:', jobToApply);
        return [...prev, jobToApply];
      }
      console.log('Already applied to job:', jobId);
      return prev; // Already applied, don't duplicate
    });
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
    return savedJobs.some(job => job.id === jobId);
  };

  const isJobApplied = (jobId) => {
    return appliedJobs.some(job => job.id === jobId);
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
