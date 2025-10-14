import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useGetUser } from "@/api/apiUsers";
import { useGetJobsByRecruiter } from "@/api/apiJobs";
import { useGetApplicationsByJob } from "@/api/apiApplication";
import { useUpdateApplicationStatus } from "@/api/apiApplication";
import { useToast } from "@/context/ToastContext";
import { 
  Users, 
  Building2, 
  MapPin, 
  Calendar, 
  Eye, 
  CheckCircle, 
  X, 
  Clock, 
  TrendingUp,
  FileText,
  User,
  Mail,
  Phone,
  Star,
  Filter,
  Search,
  Download,
  ExternalLink,
  ArrowRight,
  Briefcase,
  DollarSign,
  Award,
  Target,
  BarChart3,
  UserCheck,
  UserX,
  Code
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Separate component for job card to properly use hooks
const JobCard = ({ job, isSelected, onSelect }) => {
  // Only call the hook if job._id exists and is valid
  const applications = useGetApplicationsByJob(job?._id && job._id !== "undefined" ? job._id : null);
  const applicantsCount = applications?.length || 0;
  
  return (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
        isSelected 
          ? 'bg-gradient-to-br from-blue-600/30 to-purple-600/30 border-blue-500/60 shadow-2xl shadow-blue-500/20' 
          : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-blue-500/10'
      }`}
      onClick={() => onSelect(job)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Company Logo */}
          {(() => {
            const company = job?.company;
            const companyName = company?.name || company;
            
            // First try logoUrl from database
            if (company?.logoUrl) {
              return (
                <img 
                  src={company.logoUrl} 
                  alt={companyName}
                  className="w-16 h-16 object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = '/companies/default.svg';
                  }}
                />
              );
            }
            
            // Fallback to logo mapping based on company name
            if (companyName) {
              const normalizedName = companyName.toLowerCase().trim();
              const logoMap = {
                'microsoft': '/companies/microsoft.webp',
                'google': '/companies/google.webp',
                'amazon': '/companies/amazon.svg',
                'meta': '/companies/meta.svg',
                'netflix': '/companies/netflix.png',
                'uber': '/companies/uber.svg',
                'atlassian': '/companies/atlassian.svg',
                'ibm': '/companies/ibm.svg',
                'apple': '/companies/apple.svg',
                'test company': '/companies/google.webp',
              };
              
              const logoPath = logoMap[normalizedName];
              if (logoPath) {
                return (
                  <img 
                    src={logoPath} 
                    alt={companyName}
                    className="w-16 h-16 object-contain rounded-lg"
                    onError={(e) => {
                      e.target.src = '/companies/default.svg';
                    }}
                  />
                );
              }
            }
            
            // Final fallback to default icon
            return (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center flex-shrink-0">
                <Building2 size={24} className="text-blue-400" />
              </div>
            );
          })()}
          
          {/* Job Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
              {job.title}
            </h3>
            
            <div className="grid grid-cols-1 gap-3 mb-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Building2 size={16} className="text-blue-400" />
                <span className="font-medium truncate">{job.company?.name || 'Company Not Available'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <MapPin size={16} className="text-green-400" />
                <span className="truncate">{job.location}</span>
              </div>
              {job.salaryMin && (
                <div className="flex items-center gap-2 text-gray-300">
                  <DollarSign size={16} className="text-yellow-400" />
                  <span>
                    ${job.salaryMin.toLocaleString()}
                    {job.salaryMax && ` - $${job.salaryMax.toLocaleString()}`}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users size={14} className="text-purple-400" />
                <span>{applicantsCount} applicants</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(job);
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 text-sm"
                >
                  <Eye size={16} />
                  Manage
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ManageApplicants = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const databaseUser = useGetUser(user?.id);
  const updateApplicationStatus = useUpdateApplicationStatus();
  
  // Add error boundary for debugging
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to continue</h2>
          <p className="text-gray-400">You need to be logged in to manage applicants.</p>
        </div>
      </div>
    );
  }
  
  // State management
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Get recruiter's posted jobs
  const recruiterJobs = useGetJobsByRecruiter(user?.id);
  
  // Get applications for selected job
  const jobApplications = useGetApplicationsByJob(selectedJob?._id && selectedJob._id !== "undefined" ? selectedJob._id : null);
  
  // Debug logging (reduced)
  // console.log('🔍 Manage Applicants Debug:', { user: user?.id, recruiterJobs: recruiterJobs?.length, selectedJob: selectedJob?._id, jobApplications: jobApplications?.length });
  
  // Check if user is a recruiter
  const isRecruiter = databaseUser?.role === "recruiter";
  
  // Filter applications based on search and status
  const filteredApplications = jobApplications?.filter(app => {
    const matchesSearch = !searchTerm || 
      app.candidate?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.candidate?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      selectedJob?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  // Get status info
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: Clock, label: 'Pending' };
      case 'reviewed':
        return { color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Eye, label: 'Under Review' };
      case 'shortlisted':
        return { color: 'bg-green-500/20 text-green-300 border-green-500/30', icon: CheckCircle, label: 'Shortlisted' };
      case 'scheduled_for_interview':
        return { color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Calendar, label: 'Interview Scheduled' };
      case 'interviewed':
        return { color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: CheckCircle, label: 'Interviewed' };
      case 'rejected':
        return { color: 'bg-red-500/20 text-red-300 border-red-500/30', icon: X, label: 'Rejected' };
      case 'hired':
        return { color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: UserCheck, label: 'Hired' };
      default:
        return { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', icon: Clock, label: 'Unknown' };
    }
  };
  
  // Handle status update
  const handleStatusUpdate = async (applicationId, newStatus) => {
    setIsUpdating(true);
    try {
      await updateApplicationStatus({
        applicationId,
        status: newStatus
      });
      showSuccess(`Application status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating application status:', error);
      showError('Failed to update application status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle viewing application details
  const handleViewDetails = (application) => {
    // Store application data in localStorage for the candidate details page
    localStorage.setItem('selectedApplication', JSON.stringify(application));
    // Navigate to candidate details page
    navigate(`/candidate-details/${application._id}`);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };
  
  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get application statistics
  const getApplicationStats = () => {
    if (!jobApplications) return { total: 0, pending: 0, shortlisted: 0, rejected: 0, hired: 0 };
    
    return {
      total: jobApplications.length,
      pending: jobApplications.filter(app => app.status === 'pending').length,
      shortlisted: jobApplications.filter(app => app.status === 'shortlisted').length,
      rejected: jobApplications.filter(app => app.status === 'rejected').length,
      hired: jobApplications.filter(app => app.status === 'hired').length
    };
  };
  
  const stats = getApplicationStats();
  
  if (!isRecruiter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
            <p className="text-gray-600">This section is only available for recruiters.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <>
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Blur Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        
        {/* Additional Professional Effects */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Modern Header */}
          <div className="mb-12">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/25">
                <Users size={36} className="text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Manage Applicants
                </h1>
                <p className="text-gray-300 text-xl leading-relaxed">
                  Review and manage candidates for your job postings with real-time updates
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Building2 size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{recruiterJobs?.length || 0}</p>
                    <p className="text-blue-300 text-sm">Active Jobs</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Users size={24} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-purple-300 text-sm">Total Applications</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle size={24} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{stats.shortlisted}</p>
                    <p className="text-green-300 text-sm">Shortlisted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Selection */}
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Building2 size={24} className="text-blue-400" />
                  Select Job to Manage
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recruiterJobs && recruiterJobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recruiterJobs.map((job) => (
                      <JobCard
                        key={job._id}
                        job={job}
                        isSelected={selectedJob?._id === job._id}
                        onSelect={setSelectedJob}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building2 size={48} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Jobs Posted</h3>
                    <p className="text-gray-400 mb-4">You haven't posted any jobs yet.</p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Briefcase size={16} className="mr-2" />
                      Post Your First Job
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Application Management */}
          {selectedJob && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 backdrop-blur-sm border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <Users size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                        <p className="text-blue-300 text-sm">Total Applications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/20 backdrop-blur-sm border-yellow-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <Clock size={24} className="text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats.pending}</p>
                        <p className="text-yellow-300 text-sm">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 backdrop-blur-sm border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <CheckCircle size={24} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats.shortlisted}</p>
                        <p className="text-green-300 text-sm">Shortlisted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 backdrop-blur-sm border-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                        <X size={24} className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                        <p className="text-red-300 text-sm">Rejected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 backdrop-blur-sm border-emerald-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <UserCheck size={24} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{stats.hired}</p>
                        <p className="text-emerald-300 text-sm">Hired</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters and Search */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-6">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search applicants by name, email, or job title..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white/5 border-white/20 text-white"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-48">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-white/5 border-white/20 text-white">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Under Review</SelectItem>
                          <SelectItem value="shortlisted">Shortlisted</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Applications List */}
              {filteredApplications.length > 0 ? (
                <div className="space-y-6">
                  {filteredApplications.map((application) => {
                    const statusInfo = getStatusInfo(application.status);
                    const StatusIcon = statusInfo.icon;
                    
                    return (
                      <Card key={application._id} className="group bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02]">
                        <CardContent className="p-8">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                            
                            {/* Candidate Info */}
                            <div className="flex-1">
                              <div className="flex items-start gap-6">
                                {/* Candidate Avatar */}
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                                  <User size={24} className="text-white" />
                                </div>
                                
                                {/* Candidate Details */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                                    {application.candidate?.fullName || 'Anonymous Candidate'}
                                  </h3>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-gray-300">
                                      <Mail size={18} className="text-blue-400" />
                                      <span className="font-medium">{application.candidate?.email || 'N/A'}</span>
                                    </div>
                                    {application.candidate?.phone && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <Phone size={18} className="text-green-400" />
                                        <span>{application.candidate.phone}</span>
                                      </div>
                                    )}
                                    {application.candidate?.location && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <MapPin size={18} className="text-purple-400" />
                                        <span>{application.candidate.location}</span>
                                      </div>
                                    )}
                                    {application.candidate?.experienceYears && (
                                      <div className="flex items-center gap-2 text-gray-300">
                                        <Award size={18} className="text-orange-400" />
                                        <span>{application.candidate.experienceYears} years experience</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                      <Calendar size={16} className="text-purple-400" />
                                      <span>Applied on {formatDate(application.appliedAt)}</span>
                                    </div>
                                    {(application.resumeFile?.fileUrl || application.resumeUrl) && (
                                      <div className="flex items-center gap-1 text-purple-400">
                                        <FileText size={14} />
                                        <span className="text-xs">Resume Available</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Status and Actions */}
                            <div className="flex flex-col items-end gap-4">
                              <Badge className={`${statusInfo.color} border px-4 py-2 text-sm font-semibold`}>
                                <StatusIcon size={16} className="mr-2" />
                                {statusInfo.label}
                              </Badge>
                              
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleViewDetails(application)}
                                  variant="outline"
                                  size="sm"
                                  className="border-blue-500/40 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400/60 transition-all duration-300 hover:scale-105"
                                >
                                  <Eye size={16} className="mr-2" />
                                  View Details
                                </Button>
                                
                                {/* Quick Resume Access */}
                                {(() => {
                                  const url = application.resumeFile?.fileUrl || application.resumeUrl;
                                  const isValidUrl = url && 
                                    !url.startsWith('/') && 
                                    !url.includes('Profile%20Resume') &&
                                    !url.includes('Profile Resume') &&
                                    url.startsWith('http') &&
                                    url.length >= 10 &&
                                    !application.resumeFile?._invalidId && 
                                    !application.resumeFile?._error;
                                  
                                  if (isValidUrl) {
                                    return (
                                      <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 hover:border-purple-400/50 rounded-md transition-all duration-300 text-sm"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <FileText size={16} />
                                        Resume
                                      </a>
                                    );
                                  }
                                  return null;
                                })()}
                                
                                {/* Resume Error Indicator */}
                                {(application.resumeFile?._invalidId || application.resumeFile?._error) && (
                                  <div className="flex items-center gap-2 px-3 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-md text-sm">
                                    <FileText size={16} />
                                    Corrupted
                                  </div>
                                )}
                                
                                {application.status === 'pending' && (
                                  <>
                                    <Button 
                                      onClick={() => handleStatusUpdate(application._id, 'shortlisted')}
                                      disabled={isUpdating}
                                      size="sm"
                                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
                                    >
                                      <CheckCircle size={16} className="mr-2" />
                                      Shortlist
                                    </Button>
                                    <Button 
                                      onClick={() => handleStatusUpdate(application._id, 'rejected')}
                                      disabled={isUpdating}
                                      variant="destructive"
                                      size="sm"
                                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-red-500/25 transition-all duration-300 hover:scale-105"
                                    >
                                      <X size={16} className="mr-2" />
                                      Reject
                                    </Button>
                                  </>
                                )}
                                
                                {application.status === 'shortlisted' && (
                                  <Button 
                                    onClick={() => handleStatusUpdate(application._id, 'hired')}
                                    disabled={isUpdating}
                                    size="sm"
                                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                                  >
                                    <UserCheck size={16} className="mr-2" />
                                    Hire
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Application Notes */}
                          {application.notes && (
                            <div className="mt-6 pt-6 border-t border-white/10">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                  <FileText size={16} className="text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-300 mb-1">Application Notes</p>
                                  <p className="text-gray-400">{application.notes}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                /* No Applications - Modern Empty State */
                <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border-white/10">
                  <CardContent className="p-16 text-center">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-8">
                      <Users size={48} className="text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">No Applications Found</h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                      {searchTerm || statusFilter !== "all" 
                        ? "No applications match your current filters. Try adjusting your search criteria."
                        : "No candidates have applied to this job yet. Share your job posting to attract more applicants."
                      }
                    </p>
                    {(searchTerm || statusFilter !== "all") && (
                      <Button 
                        onClick={() => {
                          setSearchTerm("");
                          setStatusFilter("all");
                        }}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </main>

    {/* Application Details Modal */}
    {isModalOpen && selectedApplication && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Candidate Details</h2>
                  <p className="text-gray-400">{selectedApplication.candidate?.fullName || 'Unknown Candidate'} - {selectedJob?.title}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-gray-400" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Application Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-white font-semibold">Application Status</span>
              </div>
              <Badge className={`${getStatusInfo(selectedApplication.status).color} border px-4 py-2 text-sm font-semibold`}>
                {(() => {
                  const StatusIcon = getStatusInfo(selectedApplication.status).icon;
                  return <StatusIcon size={16} className="mr-2" />;
                })()}
                {getStatusInfo(selectedApplication.status).label}
              </Badge>
            </div>

            {/* Candidate Information */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <User size={20} className="text-blue-400" />
                <h3 className="text-xl font-bold text-white">Candidate Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-400">{selectedApplication.email || selectedApplication.candidate?.email || 'N/A'}</p>
                  </div>
                </div>
                {(selectedApplication.phone || selectedApplication.candidate?.phone) && (
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Phone</p>
                      <p className="text-gray-400">{selectedApplication.phone || selectedApplication.candidate?.phone}</p>
                    </div>
                  </div>
                )}
                {(selectedApplication.location || selectedApplication.candidate?.location) && (
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Location</p>
                      <p className="text-gray-400">{selectedApplication.location || selectedApplication.candidate?.location}</p>
                    </div>
                  </div>
                )}
                {(selectedApplication.experienceYears || selectedApplication.candidate?.experienceYears) && (
                  <div className="flex items-center gap-3">
                    <Award size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Experience</p>
                      <p className="text-gray-400">{selectedApplication.experienceYears || selectedApplication.candidate?.experienceYears} years</p>
                    </div>
                  </div>
                )}
                {selectedApplication.currentPosition && (
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Current Role</p>
                      <p className="text-gray-400">{selectedApplication.currentPosition}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.currentCompany && (
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Current Company</p>
                      <p className="text-gray-400">{selectedApplication.currentCompany}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Skills Section */}
              {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Code size={16} className="text-gray-400" />
                    <p className="text-white font-semibold">Skills</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Application Date */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-400" />
                <div>
                  <p className="text-white font-semibold">Applied On</p>
                  <p className="text-gray-400">{formatDate(selectedApplication.appliedAt)}</p>
                </div>
              </div>
            </div>

            {/* Candidate Skills */}
            {selectedApplication.candidate?.skills && selectedApplication.candidate.skills.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target size={20} className="text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.candidate.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-300 bg-purple-500/10">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Candidate Information */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <User size={20} className="text-orange-400" />
                <h3 className="text-xl font-bold text-white">Additional Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedApplication.candidate?.education && (
                  <div className="flex items-center gap-3">
                    <Award size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Education</p>
                      <p className="text-gray-400">{selectedApplication.candidate.education}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.candidate?.currentCompany && (
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Current Company</p>
                      <p className="text-gray-400">{selectedApplication.candidate.currentCompany}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.candidate?.currentPosition && (
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Current Position</p>
                      <p className="text-gray-400">{selectedApplication.candidate.currentPosition}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.candidate?.availability && (
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Availability</p>
                      <p className="text-gray-400">{selectedApplication.candidate.availability}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.candidate?.expectedSalary && (
                  <div className="flex items-center gap-3">
                    <DollarSign size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Expected Salary</p>
                      <p className="text-gray-400">{selectedApplication.candidate.expectedSalary}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.candidate?.noticePeriod && (
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Notice Period</p>
                      <p className="text-gray-400">{selectedApplication.candidate.noticePeriod}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Letter */}
            {selectedApplication.coverLetter && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={20} className="text-green-400" />
                  <h3 className="text-xl font-bold text-white">Cover Letter</h3>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedApplication.coverLetter}
                  </p>
                </div>
              </div>
            )}

            {/* Resume */}
            {(selectedApplication.resumeUrl || selectedApplication.resumeFile) && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Download size={20} className="text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Resume</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <FileText size={24} className="text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">
                      {selectedApplication.resumeFile?.fileName || selectedApplication.resumeFileName || 'Resume File'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {selectedApplication.resumeFile?.fileSize 
                        ? `${(selectedApplication.resumeFile.fileSize / 1024).toFixed(1)} KB`
                        : selectedApplication.resumeFileType 
                          ? `Type: ${selectedApplication.resumeFileType}`
                          : 'Uploaded with application'
                      }
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {/* View Resume Button */}
                    {(() => {
                      const url = selectedApplication.resumeFile?.fileUrl || selectedApplication.resumeUrl;
                      const isValidUrl = url && 
                        !url.startsWith('/') && 
                        !url.includes('Profile%20Resume') &&
                        !url.includes('Profile Resume') &&
                        url.startsWith('http') &&
                        url.length >= 10 &&
                        !selectedApplication.resumeFile?._invalidId && 
                        !selectedApplication.resumeFile?._error;
                      
                      if (isValidUrl) {
                        return (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                            View Resume
                          </a>
                        );
                      }
                      return null;
                    })()}
                    
                    {/* Resume Error Message */}
                    {(selectedApplication.resumeFile?._invalidId || selectedApplication.resumeFile?._error) && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-300 rounded-lg">
                        <FileText size={16} />
                        Resume file corrupted
                      </div>
                    )}
                    
                    {/* Download Resume Button */}
                    {(() => {
                      const url = selectedApplication.resumeFile?.fileUrl || selectedApplication.resumeUrl;
                      const isValidUrl = url && 
                        !url.startsWith('/') && 
                        !url.includes('Profile%20Resume') &&
                        !url.includes('Profile Resume') &&
                        url.startsWith('http') &&
                        url.length >= 10 &&
                        !selectedApplication.resumeFile?._invalidId && 
                        !selectedApplication.resumeFile?._error;
                      
                      if (isValidUrl) {
                        return (
                          <a
                            href={url}
                            download={selectedApplication.resumeFile?.fileName || selectedApplication.resumeFileName || 'resume.pdf'}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <Download size={16} />
                            Download
                          </a>
                        );
                      }
                      return null;
                    })()}
                    
                    {/* Fallback for processing files */}
                    {!selectedApplication.resumeFile?.fileUrl && !selectedApplication.resumeUrl && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-gray-300 rounded-lg">
                        <FileText size={16} />
                        File Processing
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Resume Preview Section */}
                {(selectedApplication.resumeFile?.fileUrl || selectedApplication.resumeUrl) && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye size={16} className="text-blue-400" />
                      <span className="text-sm font-medium text-gray-300">Resume Preview</span>
                    </div>
                    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-purple-400" />
                          <span className="text-sm text-gray-300">
                            {selectedApplication.resumeFile?.fileName || selectedApplication.resumeFileName || 'resume.pdf'}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={selectedApplication.resumeFile?.fileUrl || selectedApplication.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1 bg-blue-600/20 text-blue-300 rounded-md hover:bg-blue-600/30 transition-colors"
                          >
                            Open in New Tab
                          </a>
                          <a
                            href={selectedApplication.resumeFile?.fileUrl || selectedApplication.resumeUrl}
                            download={selectedApplication.resumeFile?.fileName || selectedApplication.resumeFileName || 'resume.pdf'}
                            className="text-xs px-3 py-1 bg-green-600/20 text-green-300 rounded-md hover:bg-green-600/30 transition-colors"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                      
                      {/* Embedded PDF Viewer */}
                      <div className="w-full h-96 border border-gray-600/50 rounded-lg overflow-hidden">
                        <iframe
                          src={`${selectedApplication.resumeFile?.fileUrl || selectedApplication.resumeUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                          className="w-full h-full"
                          title="Resume Preview"
                          onError={(e) => {
                            console.error('Error loading resume preview:', e);
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="hidden w-full h-full items-center justify-center bg-gray-800/50 text-gray-400"
                          style={{ display: 'none' }}
                        >
                          <div className="text-center">
                            <FileText size={48} className="mx-auto mb-4 text-gray-500" />
                            <p className="text-lg font-medium mb-2">Resume Preview Not Available</p>
                            <p className="text-sm mb-4">The resume file cannot be previewed in the browser.</p>
                            <div className="flex gap-2 justify-center">
                              <a
                                href={selectedApplication.resumeFile?.fileUrl || selectedApplication.resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                              >
                                <ExternalLink size={16} className="inline mr-2" />
                                Open Resume
                              </a>
                              <a
                                href={selectedApplication.resumeFile?.fileUrl || selectedApplication.resumeUrl}
                                download={selectedApplication.resumeFile?.fileName || selectedApplication.resumeFileName || 'resume.pdf'}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
                              >
                                <Download size={16} className="inline mr-2" />
                                Download
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-xs text-gray-500 text-center">
                        💡 Tip: If the preview doesn't load, use the "Open in New Tab" or "Download" buttons above
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Job Details */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 size={20} className="text-blue-400" />
                <h3 className="text-xl font-bold text-white">Job Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Location</p>
                    <p className="text-gray-400">{selectedJob?.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Job Type</p>
                    <p className="text-gray-400 capitalize">{selectedJob?.jobType?.replace('-', ' ')}</p>
                  </div>
                </div>
                {selectedJob?.salaryMin && (
                  <div className="flex items-center gap-3">
                    <DollarSign size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Salary</p>
                      <p className="text-gray-400">
                        ${selectedJob.salaryMin.toLocaleString()}
                        {selectedJob.salaryMax && ` - $${selectedJob.salaryMax.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <TrendingUp size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Experience Level</p>
                    <p className="text-gray-400 capitalize">{selectedJob?.experienceLevel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Notes */}
            {selectedApplication.notes && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={20} className="text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Recruiter Notes</h3>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300">{selectedApplication.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-900 border-t border-white/10 p-6 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {selectedApplication.status === 'pending' && (
                  <>
                    <Button 
                      onClick={() => handleStatusUpdate(selectedApplication._id, 'shortlisted')}
                      disabled={isUpdating}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Shortlist
                    </Button>
                    <Button 
                      onClick={() => handleStatusUpdate(selectedApplication._id, 'rejected')}
                      disabled={isUpdating}
                      variant="destructive"
                    >
                      <X size={16} className="mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedApplication.status === 'shortlisted' && (
                  <Button 
                    onClick={() => handleStatusUpdate(selectedApplication._id, 'hired')}
                    disabled={isUpdating}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <UserCheck size={16} className="mr-2" />
                    Hire
                  </Button>
                )}
              </div>
              <Button
                onClick={closeModal}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default ManageApplicants;
