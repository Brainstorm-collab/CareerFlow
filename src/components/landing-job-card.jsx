import { MapPin, Briefcase, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useJobContext } from "@/context/JobContext";
import { useState, useEffect } from "react";

const LandingJobCard = ({ job, isRecruiter = false }) => {
  const { user } = useUser();
  const { saveJob, removeSavedJob, isJobSaved } = useJobContext();
  const [isSaved, setIsSaved] = useState(false);

  // Check if job is saved when component mounts
  useEffect(() => {
    if (user && job) {
      const saved = isJobSaved(job.id);
      setIsSaved(saved);
    }
  }, [user, job, isJobSaved]);

  // Function to get the correct company logo path (same as landing page)
  const getCompanyLogoPath = (companyName) => {
    // If the job has a custom logo (from recruiter), use it
    if (job.company?.logo) {
      return job.company.logo;
    }
    
    // Otherwise use default company logos
    const name = (companyName || '').toLowerCase();
    if (name === 'google') return '/companies/google.webp';
    if (name === 'microsoft') return '/companies/microsoft.webp';
    if (name === 'amazon') return '/companies/amazon.svg';
    if (name === 'meta') return '/companies/meta.svg';
    if (name === 'apple') return '/companies/apple.svg';
    if (name === 'netflix') return '/companies/netflix.png';
    if (name === 'uber') return '/companies/uber.svg';
    if (name === 'ibm') return '/companies/ibm.svg';
    if (name === 'atlassian') return '/companies/atlassian.svg';
    return '/companies/default.svg';
  };

  // Handle save/unsave job
  const handleSaveJob = async () => {
    if (!user) return;
    
    try {
      console.log('Save button clicked for job:', job.id, 'Current saved state:', isSaved);
      
      if (isSaved) {
        await removeSavedJob(job.id);
        setIsSaved(false);
        console.log('Job unsaved successfully');
      } else {
        await saveJob(job.id, job);
        setIsSaved(true);
        console.log('Job saved successfully');
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
    }
  };

  return (
    <Card className="bg-black/70 backdrop-blur-sm border border-white/20 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 transform hover:-translate-y-1">
      <CardContent className="p-6">
        {/* Recruiter Badge - Top Left */}
        {isRecruiter && (
          <div className="absolute top-3 left-3">
            <div className="bg-blue-600/90 border border-blue-400/70 text-blue-100 text-xs backdrop-blur-sm font-bold px-2 py-1 rounded-md">
              👨‍💼 Recruiter
            </div>
          </div>
        )}

        {/* Job Title */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-white leading-tight">
            {job.title}
          </h3>
        </div>

        {/* Company Logo and Name */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <img 
            src={getCompanyLogoPath(job.company?.name || job.company)} 
            alt={`${job.company?.name || job.company} logo`}
            className="w-10 h-10 object-contain rounded-lg"
            onError={(e) => {
              e.target.src = '/companies/default.svg';
            }}
          />
          <span className="text-gray-300 text-sm font-medium">
            {job.company?.name || job.company}
          </span>
        </div>

        {/* Job Description */}
        <div className="text-center mb-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            {job.company?.name || job.company} is looking for a skilled {job.title} to join our team.
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-2 text-gray-300 text-sm mb-4">
          <MapPin size={14} className="text-blue-400" />
          <span className="text-gray-200">{job.location}</span>
        </div>

        {/* Job Type & Experience */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <div className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 rounded-full px-2 py-1">
            <Briefcase size={12} className="text-purple-300" />
            <span className="text-purple-200 text-xs font-medium capitalize">
              {job.job_type?.replace('-', ' ')}
            </span>
          </div>
          <div className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2 py-1">
            <Clock size={12} className="text-orange-300" />
            <span className="text-orange-200 text-xs font-medium capitalize">
              {job.experience_level}
            </span>
          </div>
        </div>

        {/* Remote Work Badge */}
        {job.remote_work && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1">
              <span className="text-green-300 text-xs font-medium">🌐 Remote</span>
            </div>
          </div>
        )}

        {/* Salary Information */}
        {(job.salary_min || job.salary_max) && (
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1.5">
              <span className="text-emerald-200 text-xs font-medium">
                {job.salary_min && job.salary_max 
                  ? `₹${(job.salary_min / 1000).toFixed(0)}k - ₹${(job.salary_max / 1000).toFixed(0)}k`
                  : job.salary_min 
                    ? `₹${(job.salary_min / 1000).toFixed(0)}k+`
                    : `Up to ₹${(job.salary_max / 1000).toFixed(0)}k`
                }
              </span>
            </div>
          </div>
        )}

        {/* View Details Button */}
        <div className="text-center">
          <Link to={`/job/${job.id}`}>
            <Button 
              variant="secondary" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 transition-all duration-300 text-sm shadow-lg hover:shadow-blue-500/25"
            >
              {isRecruiter ? 'View Job Details' : 'View Details'}
            </Button>
          </Link>
        </div>

        {/* Save Button - Only for non-recruiters */}
        {!isRecruiter && (
          <div className="text-center mt-3">
            <Button 
              variant="outline" 
              onClick={handleSaveJob}
              className={`w-full transition-all duration-300 ${
                isSaved 
                  ? 'border-blue-500/50 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                  : 'border-green-500/50 hover:bg-green-500/20 text-green-300 hover:border-green-400'
              }`}
            >
              {isSaved ? (
                <div className="flex items-center gap-2">
                  <BookmarkCheck size={16} className="text-blue-400" />
                  Saved
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Bookmark size={16} className="text-green-400" />
                  Save Job
                </div>
              )}
            </Button>
          </div>
        )}

        {/* Disabled Apply Button - For recruiters */}
        {isRecruiter && (
          <div className="text-center mt-3">
            <Button 
              variant="outline" 
              disabled
              className="w-full border-gray-500/30 text-gray-500 cursor-not-allowed opacity-50"
            >
              Apply (Recruiters Cannot Apply)
            </Button>
          </div>
        )}

        {/* View Applicants Button - Only for recruiters */}
        {isRecruiter && (
          <div className="text-center mt-3">
            <Link to={`/job/${job.id}/applicants`}>
              <Button 
                variant="outline" 
                className="w-full border-blue-500/50 hover:bg-blue-500/20 text-blue-300 transition-all duration-300 hover:border-blue-400"
              >
                👥 View Applicants
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LandingJobCard;
