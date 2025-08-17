import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon, Building2, Users, Trash2, Bookmark, BookmarkCheck } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApplyJobDrawer } from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";
import { Button } from "@/components/ui/button";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob, updateHiringStatus } from "@/api/apiJobs";
import { useJobContext } from "@/context/JobContext";
import { getSupabaseClient } from "@/utils/supabase";
import { deletePostedJob } from "@/utils/local-storage-service";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/context/ToastContext";

const JobPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const { applyToJob, isJobApplied, saveJob, removeSavedJob, isJobSaved } = useJobContext();
  const [applicationCount, setApplicationCount] = useState(0);
  const [isJobSavedState, setIsJobSavedState] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  // Check if current user has applied to this job
  const hasUserApplied = user ? isJobApplied(id) : false;

  // Function to get real application count
  const fetchApplicationCount = async () => {
    try {
      console.log('Fetching application count for job:', id);
      const supabase = getSupabaseClient();
      
      // First, let's check what's in the applications table
      const { data: allApplications, error: listError } = await supabase
        .from('applications')
        .select('*')
        .eq('job_id', id);

      if (listError) {
        console.warn('Could not list applications:', listError);
      } else {
        console.log('All applications for this job:', allApplications);
      }

      // Now get the count
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('job_id', id);

      if (error) {
        console.warn('Could not fetch application count:', error);
        // Fallback to applications array length
        const fallbackCount = job?.applications?.length || 0;
        console.log('Using fallback count:', fallbackCount);
        setApplicationCount(fallbackCount);
      } else {
        console.log('Database application count:', count);
        setApplicationCount(count || 0);
      }
    } catch (error) {
      console.warn('Error fetching application count:', error);
      // Fallback to applications array length
      const fallbackCount = job?.applications?.length || 0;
      console.log('Using fallback count after error:', fallbackCount);
      setApplicationCount(fallbackCount);
    }
  };

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  // Fetch application count when job data changes
  useEffect(() => {
    if (job && id) {
      fetchApplicationCount();
    }
  }, [job, id]);

  // Check if job is saved when component mounts or job changes
  useEffect(() => {
    if (user && job) {
      const saved = isJobSaved(job.id);
      setIsJobSavedState(saved);
    }
  }, [user, job, isJobSaved]);

  // Handle save/unsave job
  const handleSaveJob = async () => {
    if (!user || !job) return;
    
    try {
      if (isJobSavedState) {
        await removeSavedJob(job.id);
        setIsJobSavedState(false);
        showSuccess('Job removed from saved jobs');
      } else {
        await saveJob(job.id, job);
        setIsJobSavedState(true);
        showSuccess('Job saved successfully!');
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      showError('Failed to save/unsave job. Please try again.');
    }
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateHiringStatus,
    {
      job_id: id,
    }
  );

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnHiringStatus(isOpen).then(() => fnJob());
  };

  // Function to refresh job data after application
  const handleApplicationSubmitted = () => {
    // Refresh job data to get updated application count
    fnJob();
    // Also fetch the latest application count
    fetchApplicationCount();
  };

  // Function to delete the job
  const handleDeleteJob = async () => {
    if (!user || !job) return;
    
    // Confirm deletion
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${job.title}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      const result = deletePostedJob(job.id, user.id);
      if (result.success) {
        console.log('Job deleted successfully');
        showSuccess('Job deleted successfully!');
        // Redirect to jobs listing page
        navigate('/jobs');
      } else {
        console.error('Failed to delete job:', result.message);
        showError('Failed to delete job. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      showError('Error deleting job. Please try again.');
    }
  };

  if (!isLoaded || loadingJob) {
    return (
      <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white mt-4 text-lg">Loading job details...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Job Header */}
        <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter mb-4">
              {job?.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <Building2 size={20} className="text-blue-400" />
              <span className="text-lg">{job?.company?.name || job?.company}</span>
            </div>
          </div>
          {/* Company Logo - Handle both default and custom logos */}
          {(job?.company?.logo || job?.company?.logo_url) && (
            <div className="relative">
              <img 
                src={job?.company?.logo || job?.company?.logo_url} 
                className="h-20 w-20 object-contain rounded-lg bg-white/10 p-2 border border-white/20" 
                alt={`${job?.company?.name || job?.company} logo`}
                onError={(e) => {
                  console.log('Logo failed to load, using default:', e.target.src);
                  e.target.src = '/companies/default.svg';
                }}
              />
              {/* Logo upload indicator for recruiter jobs */}
              {job?.company?.logo && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  📤
                </div>
              )}
            </div>
          )}
        </div>

        {/* Job Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="flex items-center gap-3 text-gray-300">
            <MapPinIcon size={20} className="text-green-400" />
            <span>{job?.location}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Briefcase size={20} className="text-purple-400" />
            <span className="capitalize">{job?.job_type?.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Users size={20} className="text-blue-400" />
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {applicationCount} Applicant{applicationCount !== 1 ? 's' : ''}
              </span>
              <button
                onClick={fetchApplicationCount}
                className="text-xs text-blue-400 hover:text-blue-300 bg-blue-500/20 px-2 py-1 rounded hover:bg-blue-500/30 transition-colors"
                title="Refresh application count"
              >
                ↻
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <span className="text-orange-400">📊</span>
            <span className="capitalize">{job?.experience_level}</span>
          </div>
        </div>

        {/* Additional Job Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {(job?.salary_min || job?.salary_max) && (
            <div className="flex items-center gap-3 text-gray-300">
              <span className="text-yellow-400 text-2xl">💰</span>
              <div>
                <div className="font-semibold text-lg">
                  {job.salary_min && job.salary_max 
                    ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L`
                    : job.salary_min 
                      ? `₹${(job.salary_min / 100000).toFixed(1)}L+`
                      : `Up to ₹${(job.salary_max / 100000).toFixed(1)}L`
                  } per annum
                </div>
                <div className="text-sm text-gray-400">Annual salary</div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 text-gray-300">
            {job?.remote_work ? (
              <>
                <span className="text-green-400 text-2xl">🌐</span>
                <div>
                  <div className="font-semibold text-lg text-green-400">Remote Work Available</div>
                  <div className="text-sm text-gray-400">Work from anywhere</div>
                </div>
              </>
            ) : (
              <>
                <span className="text-blue-400 text-2xl">🏢</span>
                <div>
                  <div className="font-semibold text-lg text-blue-400">On-site Work</div>
                  <div className="text-sm text-gray-400">Office-based position</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Job Status */}
        <div className="mb-8">
          <div className="flex items-center gap-3 text-gray-300">
            {job?.isOpen ? (
              <>
                <DoorOpen size={20} className="text-green-400" />
                <span className="text-green-400 font-semibold text-lg">Open for Applications</span>
              </>
            ) : (
              <>
                <DoorClosed size={20} className="text-red-400" />
                <span className="text-red-400 font-semibold text-lg">Applications Closed</span>
              </>
            )}
          </div>
        </div>

        {/* Hiring Status Control and Delete Button (for recruiters) */}
        {job?.recruiter_id === user?.id && (
          <div className="mb-8 space-y-4">
            {/* Hiring Status Control */}
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger
                className={`w-full text-lg py-4 ${
                  job?.isOpen 
                    ? "bg-green-950/50 border-green-500/30 text-green-400" 
                    : "bg-red-950/50 border-red-500/30 text-red-400"
                }`}
              >
                <SelectValue
                  placeholder={
                    "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                  }
                />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/20">
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Delete Job Button */}
            <div className="flex justify-center">
              <button
                onClick={handleDeleteJob}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                title="Permanently delete this job"
              >
                <Trash2 size={20} />
                Delete Job Permanently
              </button>
            </div>
          </div>
        )}

        {/* Job Description */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">About the job</h2>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <p className="text-gray-300 text-lg leading-relaxed">{job?.description}</p>
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">What we are looking for</h2>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <MDEditor.Markdown
              source={job?.requirements || '# No requirements specified'}
              className="bg-transparent text-gray-300 text-lg"
            />
          </div>
        </div>

        {/* Benefits */}
        {job?.benefits && job.benefits.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Benefits & Perks</h2>
            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Save Button (for candidates) */}
        {job?.recruiter_id !== user?.id && (
          <div className="mb-12">
            {hasUserApplied ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-3 bg-green-500/20 border border-green-500/30 rounded-full px-8 py-4 mb-6">
                  <Briefcase size={24} className="text-green-400" />
                  <span className="text-green-300 font-semibold text-lg">
                    ✓ You have already applied to this job
                  </span>
                </div>
                <p className="text-gray-400 text-center">
                  Your application is being reviewed. You can view your application status in the "My Applications" section.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-4">Interested in this position?</h3>
                  <p className="text-gray-300 text-lg mb-6">
                    Save this job to your list and apply when you're ready!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleSaveJob}
                    className={`px-8 py-3 text-lg font-semibold transition-all duration-300 shadow-lg ${
                      isJobSavedState 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white hover:shadow-red-500/25' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-blue-500/25'
                    }`}
                  >
                    {isJobSavedState ? (
                      <BookmarkCheck size={20} className="mr-2" />
                    ) : (
                      <Bookmark size={20} className="mr-2" />
                    )}
                    {isJobSavedState ? 'Unsave Job' : 'Save Job'}
                  </Button>
                  <ApplyJobDrawer
                    job={job}
                    user={user}
                    fetchJob={handleApplicationSubmitted}
                    applied={hasUserApplied}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loadingHiringStatus && (
          <div className="flex items-center justify-center py-8">
            <BarLoader width={"100%"} color="#36d7b7" />
          </div>
        )}

        {/* Applications (for recruiters) */}
        {job?.applications?.length > 0 && job?.recruiter_id === user?.id && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Applications</h2>
            <div className="space-y-4">
              {job?.applications.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Attribution */}
      <div className="text-center py-8 mt-16">
        <p className="text-gray-400 text-sm">
          Made with 💗 by G.Eesaan
        </p>
      </div>
    </main>
  );
};

export default JobPage;
