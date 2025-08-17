import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import JobCard from "./job-card";
import { getPostedJobs, deletePostedJob } from "@/utils/local-storage-service";
import { useJobContext } from "@/context/JobContext";
import { Button } from "./ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const CreatedJobs = () => {
  const { user } = useUser();
  const { jobsList } = useJobContext();
  const [createdJobs, setCreatedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (user) {
      setLoading(true);
      try {
        // Get posted jobs from local storage
        const postedJobs = getPostedJobs(user.id);
        
        // Also get jobs from context that belong to this user
        const contextJobs = jobsList.filter(job => job.recruiter_id === user.id);
        
        // Merge and deduplicate jobs
        const allJobs = [...postedJobs, ...contextJobs];
        const uniqueJobs = allJobs.filter((job, index, self) => 
          index === self.findIndex(j => j.id === job.id)
        );
        
        setCreatedJobs(uniqueJobs);
      } catch (error) {
        console.error('Error fetching created jobs:', error);
        setCreatedJobs([]);
      } finally {
        setLoading(false);
      }
    }
  }, [user, jobsList]); // Re-run when jobsList changes

  const handleJobAction = () => {
    // Refresh jobs when a job is deleted or updated
    if (user) {
      try {
        const postedJobs = getPostedJobs(user.id);
        const contextJobs = jobsList.filter(job => job.recruiter_id === user.id);
        
        const allJobs = [...postedJobs, ...contextJobs];
        const uniqueJobs = allJobs.filter((job, index, self) => 
          index === self.findIndex(j => j.id === job.id)
        );
        
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
      const result = deletePostedJob(jobId, user.id);
      if (result.success) {
        console.log('Job deleted successfully');
        showSuccess('Job deleted successfully!');
        // Refresh the jobs list
        handleJobAction();
      } else {
        console.error('Failed to delete job:', result.message);
        showError('Failed to delete job. Please try again.');
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
      for (const job of createdJobs) {
        const result = deletePostedJob(job.id, user.id);
        if (result.success) {
          deletedCount++;
        }
      }
      
      if (deletedCount > 0) {
        showSuccess(`Successfully deleted ${deletedCount} jobs!`);
        // Refresh the jobs list
        handleJobAction();
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

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {createdJobs?.length ? (
          createdJobs.map((job) => {
            return (
              <JobCard
                key={job.id}
                job={job}
                onJobAction={handleJobAction}
                isMyJob
                isRecruiter={true}
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
