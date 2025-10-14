import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetApplicationsByJob } from "@/api/apiApplication";
import { useDeleteJob } from "@/api/apiJobs";
import { useToast } from "../context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, 
  Briefcase, 
  Calendar, 
  Building2, 
  DollarSign, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  TrendingUp,
  AlertTriangle,
  Settings
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const RecruiterJobCard = ({ job, onJobDeleted }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get real-time applicant count
  const applications = useGetApplicationsByJob(job?._id);
  const applicantsCount = applications?.length || 0;
  
  // Delete job mutation
  const deleteJob = useDeleteJob();

  // Check if this is a sample job
  const isSampleJob = job._id && job._id.startsWith('k1734x8k');

  // Company logo path
  const getCompanyLogo = () => {
    if (job.company?.logoUrl) {
      return job.company.logoUrl;
    }
    
    const companyName = job.company?.name || (typeof job.company === 'string' ? job.company : '') || '';
    if (companyName && typeof companyName === 'string') {
      return `/companies/${companyName.toLowerCase().replace(/\s+/g, '')}.svg`;
    }
    return '/companies/default.svg';
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    if (typeof salary === 'string') return salary;
    if (typeof salary === 'object' && salary.min && salary.max) {
      return `$${salary.min.toLocaleString()} - $${salary.max.toLocaleString()}`;
    }
    if (typeof salary === 'number') {
      return `$${salary.toLocaleString()}`;
    }
    return String(salary);
  };

  // Get job status badge
  const getStatusBadge = () => {
    if (job.isActive === false) {
      return { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Inactive' };
    }
    if (applicantsCount > 10) {
      return { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Hot' };
    }
    if (applicantsCount > 0) {
      return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Active' };
    }
    return { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'New' };
  };

  const statusBadge = getStatusBadge();

  // Handle delete job
  const handleDeleteJob = async () => {
    if (isSampleJob) {
      showError('Cannot delete sample jobs');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${job.title}"? This action cannot be undone and will also delete all applications for this job.`
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      if (job._id) {
        // Database job - use Convex deletion
        await deleteJob({ jobId: job._id });
        showSuccess('Job deleted successfully!');
        if (onJobDeleted) onJobDeleted();
      } else {
        showError('Cannot delete this job. Invalid job ID.');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      showError('Failed to delete job. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle edit job
  const handleEditJob = () => {
    if (isSampleJob) {
      showError('Cannot edit sample jobs');
      return;
    }
    navigate(`/edit-job/${job._id}`);
  };

  // Handle view job
  const handleViewJob = () => {
    navigate(`/job/${job._id}`);
  };

  // Handle manage applicants
  const handleManageApplicants = () => {
    navigate(`/job/${job._id}/applicants`);
  };

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group relative overflow-hidden">
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={`${statusBadge.color} border px-3 py-1 text-xs font-semibold`}>
          {statusBadge.label}
        </Badge>
      </div>

      {/* 3-Dots Action Menu */}
      <div className="absolute top-4 left-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-all duration-200"
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-gray-800 border-gray-700">
            <DropdownMenuItem 
              onClick={handleViewJob}
              className="text-white hover:bg-gray-700 cursor-pointer"
            >
              <Eye size={16} className="mr-2" />
              View Job
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleManageApplicants}
              className="text-white hover:bg-gray-700 cursor-pointer"
            >
              <Users size={16} className="mr-2" />
              Manage Applicants ({applicantsCount})
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-600" />
            <DropdownMenuItem 
              onClick={handleEditJob}
              className="text-blue-400 hover:bg-gray-700 cursor-pointer"
              disabled={isSampleJob}
            >
              <Edit size={16} className="mr-2" />
              Edit Job
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDeleteJob}
              className="text-red-400 hover:bg-gray-700 cursor-pointer"
              disabled={isSampleJob || isDeleting}
            >
              <Trash2 size={16} className="mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete Job'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <img
              src={getCompanyLogo()}
              alt={job.company?.name || 'Company'}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.src = '/companies/default.svg';
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl text-white mb-1 line-clamp-2 group-hover:text-blue-300 transition-colors">
              {job.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-gray-300 mb-2">
              <Building2 size={16} />
              <span className="text-sm font-medium">
                {job.company?.name || (typeof job.company === 'string' ? job.company : 'Company')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={14} />
              <span className="text-sm">{job.location}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Job Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-gray-300">
            <Briefcase size={16} />
            <span className="text-sm">{job.jobType || 'Full-time'}</span>
          </div>
          
          {job.salary && (
            <div className="flex items-center gap-2 text-gray-300">
              <DollarSign size={16} />
              <span className="text-sm">{formatSalary(job.salary)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={16} />
            <span className="text-sm">
              Posted {(() => {
                try {
                  const date = job.createdAt || job._creationTime;
                  return date ? new Date(date).toLocaleDateString() : 'Recently';
                } catch (error) {
                  return 'Recently';
                }
              })()}
            </span>
          </div>
        </div>

        {/* Skills/Requirements Preview */}
        {(() => {
          // Ensure requirements is an array
          const requirements = Array.isArray(job.requirements) ? job.requirements : [];
          
          if (requirements.length > 0) {
            return (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {requirements.slice(0, 3).map((req, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs px-2 py-1"
                    >
                      {typeof req === 'string' ? req : String(req)}
                    </Badge>
                  ))}
                  {requirements.length > 3 && (
                    <Badge 
                      variant="secondary" 
                      className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs px-2 py-1"
                    >
                      +{requirements.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">{applicantsCount}</div>
            <div className="text-xs text-gray-400">Applicants</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-white">
              {job.views || Math.floor(Math.random() * 50) + 10}
            </div>
            <div className="text-xs text-gray-400">Views</div>
          </div>
        </div>

        {/* Primary Action Button */}
        <Button
          onClick={handleManageApplicants}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2.5 transition-all duration-300"
        >
          <Users size={16} className="mr-2" />
          Manage Applicants ({applicantsCount})
        </Button>

        {/* Sample Job Warning */}
        {isSampleJob && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <AlertTriangle size={16} />
              <span>Sample job - cannot be edited or deleted</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecruiterJobCard;
