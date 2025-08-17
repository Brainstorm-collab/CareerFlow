/* eslint-disable react/prop-types */
import { Heart, MapPin, Trash2Icon, Building2, Clock, Briefcase, DollarSign, Zap, Users, Calendar, Lock, User, Star, TrendingUp, Award, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Link } from "react-router-dom";

import { deletePostedJob } from "@/utils/local-storage-service";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { getJobApplicantsCount } from "@/utils/local-storage-service";
import { useJobContext } from "@/context/JobContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/context/ToastContext";

const JobCard = ({
  job,
  savedInit = false,
  onJobAction = () => {},
  isMyJob = false,
  isRecruiter = false,
}) => {

  const [applicantsCount, setApplicantsCount] = useState(0);
  const [loadingSave, setLoadingSave] = useState(false);

  const { user } = useUser();
  const { isJobSaved, isJobApplied, saveJob, removeSavedJob } = useJobContext();
  const { showSuccess, showError } = useToast();
  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);

  // Check if job is saved on component mount and get applicant count
  useEffect(() => {
    if (user && job) {
      // Get real applicant count
      const count = getJobApplicantsCount(job.id);
      setApplicantsCount(count);
    }
  }, [user, job]);

  const handleSaveJob = async () => {
    if (!user) return;
    
    setLoadingSave(true);
    try {
      if (saved) {
        // Remove saved job
        removeSavedJob(job.id);
        onJobAction();
      } else {
        // Save job with full job data
        saveJob(job.id, job);
        onJobAction();
      }
    } catch (error) {
      console.error('Error handling save job:', error);
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDeleteJob = async () => {
    if (!user) return;
    
    // Confirm deletion with job title
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${job.title}"?\n\nThis action cannot be undone and will remove the job from all listings.`
    );
    
    if (!confirmed) return;
    
    try {
      const result = deletePostedJob(job.id, user.id);
          if (result.success) {
      console.log('Job deleted successfully');
      // Show success message
      showSuccess(`Job "${job.title}" has been deleted successfully!`);
      onJobAction(); // Refresh the jobs list
    } else {
      console.error('Failed to delete job:', result.message);
      showError('Failed to delete job. Please try again.');
    }
  } catch (error) {
    console.error('Error deleting job:', error);
    showError('Error deleting job. Please try again.');
  }
  };

  const handleStatusUpdate = (newStatus) => {
    // Update job status locally
    const updatedJob = { ...job, status: newStatus };
    // Here you would typically call an API to update the status
    // For now, we'll just update the local state
    console.log('Status updated to:', newStatus);
    // Trigger a refresh of the jobs list
    onJobAction();
  };

  const getCompanyLogo = (company) => {
    console.log('getCompanyLogo called with:', company);
    console.log('getCompanyLogo - company type:', typeof company);
    console.log('getCompanyLogo - company keys:', company ? Object.keys(company) : 'null');
    
    // Handle different company data structures
    let companyName = '';
    let companyLogo = null;
    
    if (typeof company === 'string') {
      // Company is just a string (from API)
      companyName = company;
    } else if (company && typeof company === 'object') {
      // Company is an object (from local storage or API)
      companyName = company.name || company.company_name || '';
      companyLogo = company.logo || company.logo_url || null;
    }
    
    console.log('Extracted company name:', companyName);
    console.log('Extracted company logo:', companyLogo);
    
    // If company has a custom logo, use it
    if (companyLogo) {
      console.log('Using custom logo:', companyLogo);
      console.log('Custom logo type:', typeof companyLogo);
      console.log('Custom logo length:', companyLogo?.length);
      return companyLogo;
    }
    
    // If no company name, return default
    if (!companyName) {
      console.log('No company name, using default logo');
      return '/companies/default.svg';
    }
    
    // Normalize company name for matching
    const normalizedName = companyName.toLowerCase().trim();
    console.log('Normalized company name:', normalizedName);
    
    const logoMap = {
      'google': '/companies/google.webp',
      'microsoft': '/companies/microsoft.webp',
      'amazon': '/companies/amazon.svg',
      'meta': '/companies/meta.svg',
      'netflix': '/companies/netflix.png',
      'uber': '/companies/uber.svg',
      'atlassian': '/companies/atlassian.svg',
      'ibm': '/companies/ibm.svg',
      'apple': '/companies/apple.svg',
    };
    
    const logoPath = logoMap[normalizedName] || '/companies/default.svg';
    console.log('Selected logo path:', logoPath);
    return logoPath;
  };

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 h-full flex flex-col transform hover:-translate-y-1">
      <CardContent className="flex flex-col gap-5 flex-1 p-6">
        {/* Job Title - Clean, prominent display */}
        <div className="text-center">
          <h2 className="text-lg font-bold text-white leading-tight line-clamp-2">
            {job.title}
          </h2>
        </div>

        {/* Company Logo - Elegant display */}
        <div className="flex justify-center">
          <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-xl p-2 border border-white/20">
            <img
              src={getCompanyLogo(job.company)}
              alt={job.company?.name || 'Company'}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = '/companies/default.svg';
              }}
            />
          </div>
        </div>

        {/* Company Name - Clean badge design */}
        {(job.company?.name || (typeof job.company === 'string' && job.company)) && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-3 py-1.5">
              <Building2 size={14} className="text-blue-300" />
              <span className="text-blue-200 text-xs font-medium">
                {typeof job.company === 'string' ? job.company : job.company.name}
              </span>
            </div>
          </div>
        )}

        {/* Location - Clean location display */}
        <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
          <MapPin size={14} className="text-blue-400" />
          <span className="text-gray-200">{job.location}</span>
        </div>

        {/* Job Type & Experience - Clean badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="inline-flex items-center gap-1 bg-purple-500/20 border border-purple-500/30 rounded-full px-2 py-1">
            <Briefcase size={12} className="text-purple-300" />
            <span className="text-purple-200 text-xs font-medium capitalize">
              {job.job_type?.replace('-', ' ')}
            </span>
          </div>
          <div className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 rounded-full px-2 py-1">
            <Zap size={12} className="text-orange-300" />
            <span className="text-orange-200 text-xs font-medium capitalize">
              {job.experience_level}
            </span>
          </div>
        </div>

        {/* Remote Work Badge */}
        {job.remote_work && (
          <div className="text-center">
            <div className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1">
              <span className="text-green-300 text-xs font-medium">🌐 Remote</span>
            </div>
          </div>
        )}

        {/* Salary Information - Clean display */}
        {(job.salary_min || job.salary_max) && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-3 py-1.5">
              <DollarSign size={14} className="text-emerald-300" />
              <span className="text-emerald-200 text-xs font-medium">
                {job.salary_min && job.salary_max 
                  ? `$${(job.salary_min / 1000).toFixed(0)}k - $${(job.salary_max / 1000).toFixed(0)}k`
                  : job.salary_min 
                    ? `$${(job.salary_min / 1000).toFixed(0)}k+`
                    : `Up to $${(job.salary_max / 1000).toFixed(0)}k`
                }
              </span>
            </div>
          </div>
        )}

        {/* Applicants Count - For recruiters */}
        {isRecruiter && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-3 py-1.5">
              <Users size={14} className="text-indigo-300" />
              <span className="text-indigo-200 text-xs font-medium">
                {applicantsCount} {applicantsCount === 1 ? 'Applicant' : 'Applicants'}
              </span>
            </div>
          </div>
        )}

        {/* Delete Button for My Jobs - Top Right */}
        {isMyJob && (
          <div className="absolute top-3 right-3 z-10">
            <Trash2Icon
              size={16}
              className="text-red-400 hover:text-red-300 cursor-pointer transition-colors bg-black/80 p-1.5 rounded-md backdrop-blur-sm hover:bg-red-500/30"
              onClick={handleDeleteJob}
              title="Delete Job"
            />
          </div>
        )}

        {/* Recruiter Badge - Top Left */}
        {isRecruiter && (
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="bg-blue-600/90 border-blue-400/70 text-blue-100 text-xs backdrop-blur-sm font-bold px-2 py-1">
              <User size={12} className="mr-1" />
              Recruiter
            </Badge>
          </div>
        )}

        {/* Job Status Badge - Top Right for recruiters (adjusted position to avoid overlap with delete button) */}
        {isRecruiter && job.status && (
          <div className="absolute top-3 right-16">
            <Badge 
              variant="outline" 
              className={`text-xs backdrop-blur-sm font-bold px-2 py-1 ${
                job.status === 'open' ? 'bg-green-600/90 border-green-400/70 text-green-100' :
                job.status === 'closed' ? 'bg-red-600/90 border-red-400/70 text-red-100' :
                job.status === 'on-hold' ? 'bg-yellow-600/90 border-yellow-400/70 text-yellow-100' :
                'bg-gray-600/90 border-gray-400/70 text-gray-100'
              }`}
            >
              {job.status === 'open' ? '🟢 Open' : 
               job.status === 'closed' ? '🔴 Closed' : 
               job.status === 'on-hold' ? '🟡 On Hold' : 
               '📝 Draft'}
            </Badge>
          </div>
        )}

        {/* Applied Badge - Top Left (for candidates) */}
        {!isRecruiter && applied && (
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className="bg-green-600/90 border-green-400/70 text-green-100 text-xs backdrop-blur-sm font-bold px-2 py-1">
              <Briefcase size={12} className="mr-1" />
              Applied
            </Badge>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-3 pt-4 border-t border-gray-700/50 p-6 bg-gray-800/50">
        <Link to={`/job/${job.id}`} className="flex-1">
          <Button 
            variant="secondary" 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 transition-all duration-300 text-sm shadow-lg hover:shadow-blue-500/25"
          >
            {applied ? 'View Application' : 'View Details'}
          </Button>
        </Link>
        
        {/* Save Job Button - Only for candidates */}
        {!isMyJob && !isRecruiter && (
          <Button
            variant="outline"
            size="icon"
            className={`border-gray-600 hover:bg-gray-700/50 text-gray-300 transition-all duration-300 hover:scale-110 hover:border-gray-500 ${
              saved ? 'bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30' : ''
            }`}
            onClick={handleSaveJob}
            disabled={loadingSave}
          >
            {saved ? (
              <Heart size={18} fill="currentColor" className="text-red-400" />
            ) : (
              <Heart size={18} />
            )}
          </Button>
        )}
        
        {/* View Applicants Button - Only for recruiters */}
        {isRecruiter && (
          <Link to={`/job/${job.id}/applicants`}>
            <Button
              variant="outline"
              size="icon"
              className="border-blue-500/50 hover:bg-blue-500/20 text-blue-300 transition-all duration-300 hover:scale-110 hover:border-blue-400"
              title="View Applicants"
            >
              <Users size={18} />
            </Button>
          </Link>
        )}

        {/* Delete Job Button - Only for job owners */}
        {isMyJob && (
          <Button
            variant="destructive"
            size="icon"
            className="border-red-500/50 hover:bg-red-500/20 text-red-300 transition-all duration-300 hover:scale-110 hover:border-red-400"
            onClick={handleDeleteJob}
            title="Delete Job Permanently"
          >
            <Trash2Icon size={18} />
          </Button>
        )}

        {/* Status Update Dropdown - Only for recruiters */}
        {isRecruiter && (
          <div className="min-w-[120px]">
            <Select value={job.status || 'open'} onValueChange={handleStatusUpdate}>
              <SelectTrigger className="h-9 bg-gray-700/50 border-gray-600 text-gray-200 text-xs hover:bg-gray-700/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="open">🟢 Open</SelectItem>
                <SelectItem value="on-hold">🟡 On Hold</SelectItem>
                <SelectItem value="closed">🔴 Closed</SelectItem>
                <SelectItem value="draft">📝 Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default JobCard;
