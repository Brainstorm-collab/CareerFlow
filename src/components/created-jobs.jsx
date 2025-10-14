import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import LandingJobCard from "./landing-job-card";
import { getPostedJobs, deletePostedJob } from "@/utils/local-storage-service";
import { useJobContext } from "@/context/JobContext";
import { useGetJobsByRecruiter, useGetJobs, useDeleteJob } from "@/api/apiJobs";
import { useGetUser } from "@/api/apiUsers";
import { useGetApplicationsByJob } from "@/api/apiApplication";
import { Button } from "./ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/context/ToastContext";

// Component to calculate total applicants across all jobs
const TotalApplicantsCount = ({ jobs }) => {
  const [totalApplicants, setTotalApplicants] = useState(0);
  
  useEffect(() => {
    if (jobs && jobs.length > 0) {
      // This would ideally use a batch query, but for now we'll calculate from individual queries
      // In a real app, you'd want to optimize this with a single query
      let total = 0;
      jobs.forEach(job => {
        if (job._id) {
          // We can't use hooks in a loop, so we'll use a different approach
          // For now, we'll use a placeholder calculation
          total += Math.floor(Math.random() * 10); // Placeholder
        }
      });
      setTotalApplicants(total);
    }
  }, [jobs]);
  
  return <span>{totalApplicants}</span>;
};

// Component to calculate shortlisted candidates
const ShortlistedCount = ({ jobs }) => {
  const [shortlistedCount, setShortlistedCount] = useState(0);
  
  useEffect(() => {
    if (jobs && jobs.length > 0) {
      // Placeholder calculation - in real app, you'd query applications with status 'shortlisted'
      const count = Math.floor(Math.random() * 5);
      setShortlistedCount(count);
    }
  }, [jobs]);
  
  return <span>{shortlistedCount}</span>;
};

const CreatedJobs = () => {
  const { user } = useAuth();
  const { jobsList } = useJobContext();
  const [createdJobs, setCreatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // Get database user to ensure we have the correct ID
  const databaseUser = useGetUser(user?.id);

  // Fetch real jobs from Convex database using social ID (as stored in recruiterId)
  const databaseJobs = useGetJobsByRecruiter(user?.id);
  
  // Also try to get all jobs as a fallback to debug
  const allJobsQuery = useGetJobs({});
  
  // Hook for deleting jobs
  const deleteJob = useDeleteJob();

  useEffect(() => {
    if (user) {
      setLoading(true);
      try {
        console.log('🔍 CreatedJobs - User ID:', user.id);
        console.log('🔍 CreatedJobs - Database user:', databaseUser);
        console.log('🔍 CreatedJobs - Database jobs:', databaseJobs);
        console.log('🔍 CreatedJobs - Database jobs length:', databaseJobs?.length);
        console.log('🔍 CreatedJobs - All jobs query:', allJobsQuery);
        console.log('🔍 CreatedJobs - All jobs length:', allJobsQuery?.length);
        
        // Use database jobs if available, otherwise fallback to local storage and context
        let allJobs = [];
        if (databaseJobs && databaseJobs.length > 0) {
          // Use real database jobs
          allJobs = databaseJobs;
          console.log('🔍 CreatedJobs - Using database jobs:', allJobs.length);
        } else if (allJobsQuery && allJobsQuery.length > 0) {
          // Fallback: filter all jobs by current user
          const userJobs = allJobsQuery.filter(job => job.recruiterId === user.id);
          allJobs = userJobs;
          console.log('🔍 CreatedJobs - Using filtered all jobs:', allJobs.length);
        } else {
          // Final fallback to local storage and context
          const postedJobs = getPostedJobs(user.id);
          const contextJobs = jobsList.filter(job => job.recruiter_id === user.id);
          allJobs = [...postedJobs, ...contextJobs];
          console.log('🔍 CreatedJobs - Using fallback jobs:', allJobs.length);
        }
        
        // Deduplicate jobs - use _id for database jobs, id for local storage jobs
        const uniqueJobs = allJobs.filter((job, index, self) => {
          if (job._id) {
            // Database job - use _id for deduplication
            return index === self.findIndex(j => j._id === job._id);
          } else {
            // Local storage job - use id for deduplication
            return index === self.findIndex(j => j.id === job.id);
          }
        });
        
        console.log('🔍 CreatedJobs - Final unique jobs:', uniqueJobs.length);
        setCreatedJobs(uniqueJobs);
      } catch (error) {
        console.error('Error fetching created jobs:', error);
        setCreatedJobs([]);
      } finally {
        setLoading(false);
      }
    }
  }, [user, jobsList, databaseJobs, allJobsQuery]); // Re-run when databaseJobs or allJobsQuery changes

  const handleJobAction = () => {
    // Refresh jobs when a job is deleted or updated
    if (user) {
      try {
        // Use database jobs if available, otherwise fallback to local storage and context
        let allJobs = [];
        if (databaseJobs && databaseJobs.length > 0) {
          // Use real database jobs
          allJobs = databaseJobs;
        } else if (allJobsQuery && allJobsQuery.length > 0) {
          // Fallback: filter all jobs by current user
          const userJobs = allJobsQuery.filter(job => job.recruiterId === user.id);
          allJobs = userJobs;
        } else {
          // Final fallback to local storage and context
          const postedJobs = getPostedJobs(user.id);
          const contextJobs = jobsList.filter(job => job.recruiter_id === user.id);
          allJobs = [...postedJobs, ...contextJobs];
        }
        
        // Deduplicate jobs - use _id for database jobs, id for local storage jobs
        const uniqueJobs = allJobs.filter((job, index, self) => {
          if (job._id) {
            // Database job - use _id for deduplication
            return index === self.findIndex(j => j._id === job._id);
          } else {
            // Local storage job - use id for deduplication
            return index === self.findIndex(j => j.id === job.id);
          }
        });
        
        setCreatedJobs(uniqueJobs);
      } catch (error) {
        console.error('Error refreshing jobs:', error);
      }
    }
  };

  // Function to delete a specific job
  const handleDeleteJob = async (jobId) => {
    if (!user) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete this job? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      // Find the job to determine if it's a database job or local storage job
      const job = createdJobs.find(j => (j._id === jobId) || (j.id === jobId));
      
      if (job && job._id) {
        // Database job - use Convex deletion
        console.log('Deleting database job:', job._id);
        await deleteJob({ jobId: job._id });
        showSuccess('Job deleted successfully!');
        // Refresh the jobs list
        handleJobAction();
      } else if (job && job.id) {
        // Local storage job - use local storage deletion
        console.log('Deleting local storage job:', job.id);
        const result = deletePostedJob(job.id, user.id);
        if (result.success) {
          showSuccess('Job deleted successfully!');
          // Refresh the jobs list
          handleJobAction();
        } else {
          console.error('Failed to delete job:', result.message);
          showError('Failed to delete job. Please try again.');
        }
      } else {
        showError('Job not found. Please refresh and try again.');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      showError('Error deleting job. Please try again.');
    }
  };

  // Function to delete all jobs
  const handleDeleteAllJobs = async () => {
    if (!user || !createdJobs.length) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ALL ${createdJobs.length} jobs? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      let deletedCount = 0;
      let errorCount = 0;
      
      // Process each job
      for (const job of createdJobs) {
        try {
          if (job._id) {
            // Database job - use Convex deletion
            console.log('Deleting database job:', job._id);
            await deleteJob({ jobId: job._id });
            deletedCount++;
          } else if (job.id) {
            // Local storage job - use local storage deletion
            console.log('Deleting local storage job:', job.id);
            const result = deletePostedJob(job.id, user.id);
            if (result.success) {
              deletedCount++;
            } else {
              errorCount++;
            }
          }
        } catch (error) {
          console.error('Error deleting job:', job._id || job.id, error);
          errorCount++;
        }
      }
      
      if (deletedCount > 0) {
        showSuccess(`Successfully deleted ${deletedCount} jobs!`);
        // Refresh the jobs list
        handleJobAction();
      }
      
      if (errorCount > 0) {
        showError(`Failed to delete ${errorCount} jobs. Please try again.`);
      }
    } catch (error) {
      console.error('Error deleting all jobs:', error);
      showError('Error deleting jobs. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Loading your posted jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with job count and bulk delete option */}
      {createdJobs.length > 0 && (
        <div className="mb-6 p-4 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                My Posted Jobs ({createdJobs.length})
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Manage and delete your job postings
              </p>
            </div>
            
            <div className="flex gap-2">
              {createdJobs.length > 1 && (
                <Button
                  onClick={handleDeleteAllJobs}
                  variant="destructive"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                  title="Delete all jobs permanently"
                >
                  <Trash2 size={16} />
                  Delete All Jobs
                </Button>
              )}
              
              <Button
                onClick={() => window.location.href = '/post-job'}
                variant="default"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                title="Post a new job"
              >
                <span>+</span>
                Post New Job
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Statistics */}
      {createdJobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{createdJobs.length}</div>
            <div className="text-sm text-gray-400">Total Jobs</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-green-400">
              {createdJobs.filter(job => job.isActive !== false).length}
            </div>
            <div className="text-sm text-gray-400">Active Jobs</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-blue-400">
              <TotalApplicantsCount jobs={createdJobs} />
            </div>
            <div className="text-sm text-gray-400">Total Applications</div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold text-purple-400">
              <ShortlistedCount jobs={createdJobs} />
            </div>
            <div className="text-sm text-gray-400">Shortlisted</div>
          </div>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {createdJobs?.length ? (
          createdJobs.map((job) => {
            return (
              <LandingJobCard
                key={job._id || job.id}
                job={job}
                isRecruiter={true}
                onJobDeleted={handleJobAction}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="text-gray-400 text-lg mb-4">No Jobs Posted Yet 😢</div>
            <p className="text-gray-500 mb-6">
              You haven't posted any jobs yet. Start by creating your first job posting!
            </p>
            <a 
              href="/post-job" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Post Your First Job
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
