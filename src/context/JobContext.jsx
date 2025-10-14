import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

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

  // Load jobs list from localStorage on mount
  useEffect(() => {
    const jobsListData = localStorage.getItem('jobsList');
    if (jobsListData) {
      try {
        const parsedJobs = JSON.parse(jobsListData);
        setJobsList(parsedJobs);
      } catch (error) {
        console.error('Error parsing jobs list from localStorage:', error);
        setJobsList([]);
      }
    }
  }, []);

  // Save jobs list to localStorage whenever it changes
  useEffect(() => {
    if (jobsList.length > 0) {
      localStorage.setItem('jobsList', JSON.stringify(jobsList));
    }
  }, [jobsList]);

  // Add a new job to the list
  const addNewJob = (job) => {
    setJobsList(prev => [job, ...prev]);
  };

  // Get saved jobs data (for backward compatibility)
  const getSavedJobsData = () => {
    // This is now handled by Convex hooks in components
    return [];
  };

  // Get applied jobs data (for backward compatibility)
  const getAppliedJobsData = () => {
    // This is now handled by Convex hooks in components
    return [];
  };

  // Update job in the list
  const updateJob = (jobId, updates) => {
    setJobsList(prev => 
      prev.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      )
    );
  };

  // Remove job from the list
  const removeJob = (jobId) => {
    setJobsList(prev => prev.filter(job => job.id !== jobId));
  };

  // OPTIMIZATION: Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    jobsList,
    setJobsList,
    addNewJob,
    updateJob,
    removeJob,
    getSavedJobsData,
    getAppliedJobsData,
  }), [jobsList]);

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};
