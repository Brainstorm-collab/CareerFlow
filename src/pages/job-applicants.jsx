import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetJob } from "@/api/apiJobs";
import { useGetApplicationsByJob, useUpdateApplicationStatus } from "@/api/apiApplication";
import { useToast } from "@/context/ToastContext";
import { 
  Users, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building2, 
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Heart,
  UserCheck,
  UserX,
  Briefcase
} from "lucide-react";

const JobApplicants = () => {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Fetch real data
  const job = useGetJob(jobId);
  const applications = useGetApplicationsByJob(jobId);
  const updateApplicationStatus = useUpdateApplicationStatus();

  const loading = !job || !applications;

  // Debug logging
  // console.log('🔍 Job Applicants Debug:');
  // console.log('🔍 jobId:', jobId);
  // console.log('🔍 job:', job);
  // console.log('🔍 applications:', applications);
  // console.log('🔍 applications type:', typeof applications);
  // console.log('🔍 applications length:', applications?.length);
  // if (applications && applications.length > 0) {
  //   console.log('🔍 First application:', applications[0]);
  //   console.log('🔍 First application candidate:', applications[0]?.candidate);
  // }

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await updateApplicationStatus({
        applicationId,
        status: newStatus
      });
      showSuccess(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating application status:', error);
      showError('Failed to update application status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'reviewed': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      case 'shortlisted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled_for_interview': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'interviewed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'hired': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'reviewed': return <Eye size={16} />;
      case 'shortlisted': return <CheckCircle size={16} />;
      case 'scheduled_for_interview': return <Calendar size={16} />;
      case 'interviewed': return <UserCheck size={16} />;
      case 'hired': return <Star size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-x-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Floating Blur Effects */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-x-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Floating Blur Effects */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-center max-w-md">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
              <p className="text-gray-300 mb-6">
                The job you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link to="/my-jobs">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Back to My Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Blur Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Job Applicants</h1>
              <p className="text-gray-300">
                Manage applications for: <span className="text-blue-400 font-semibold">{job?.title}</span>
              </p>
            </div>
            <Link to="/my-jobs">
              <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                ← Back to My Jobs
              </Button>
            </Link>
          </div>
          
          {/* Enhanced Job Summary */}
          <Card className="bg-gradient-to-r from-gray-900/50 to-blue-900/30 backdrop-blur-sm border-white/20 shadow-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* Job Header with Image */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="text-2xl font-bold mb-1">{job?.title}</h2>
                      <p className="text-blue-100 text-sm">Manage Applications</p>
                    </div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
                </div>
                
                {/* Job Details */}
                <div className="p-6">
                  <div className="flex items-start gap-6 mb-6">
                    {/* Company Logo/Image */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20">
                        {job?.company?.logoUrl ? (
                          <img 
                            src={job.company.logoUrl} 
                            alt={job?.company?.name || 'Company'} 
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <Building2 size={32} className="text-white" />
                        )}
                      </div>
                    </div>
                    
                    {/* Company Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {job?.company?.name || 'Unknown Company'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} className="text-green-400" />
                          <span>{job?.location || 'Remote'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="text-yellow-400" />
                          <span>Posted {new Date(job?.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                          {job?.jobType || 'Full-time'}
                        </Badge>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                          {job?.experienceLevel || 'Mid-level'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <Users size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">{applications?.length || 0}</p>
                          <p className="text-sm text-gray-400">Applications</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <CheckCircle size={20} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {applications?.filter(app => app.status === 'shortlisted').length || 0}
                          </p>
                          <p className="text-sm text-gray-400">Shortlisted</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                          <Clock size={20} className="text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {applications?.filter(app => app.status === 'pending').length || 0}
                          </p>
                          <p className="text-sm text-gray-400">Pending</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                          <Star size={20} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {applications?.filter(app => app.status === 'hired').length || 0}
                          </p>
                          <p className="text-sm text-gray-400">Hired</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applicants List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applicants List */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-gray-900/50 to-blue-900/30 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="border-b border-white/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Users size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <span>Applicants</span>
                      <p className="text-sm text-gray-400 font-normal">({applications?.length || 0} total)</p>
                    </div>
                  </CardTitle>
                  
                  {/* Filter/Sort Options */}
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                      All Status
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  {applications?.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Applications Yet</h3>
                      <p className="text-gray-400">Applications will appear here when candidates apply for this job.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/10">
                      {applications?.map((application) => (
                        <div
                          key={application._id}
                          className={`p-6 cursor-pointer transition-all duration-300 hover:bg-white/5 group ${
                            selectedApplicant?._id === application._id 
                              ? 'bg-blue-500/10 border-l-4 border-blue-500' 
                              : ''
                          }`}
                          onClick={() => setSelectedApplicant(application)}
                        >
                          <div className="flex items-start gap-4">
                            {/* Enhanced Avatar */}
                            <div className="relative flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white/20">
                                {application.candidate?.fullName && typeof application.candidate.fullName === 'string' 
                                  ? application.candidate.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)
                                  : 'U'
                                }
                              </div>
                              {application.status === 'shortlisted' && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                  <CheckCircle size={12} className="text-white" />
                                </div>
                              )}
                            </div>
                            
                            {/* Candidate Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                    {application.candidate?.fullName || 'Unknown Candidate'}
                                  </h3>
                                  <p className="text-gray-400 text-sm flex items-center gap-2">
                                    <Mail size={14} />
                                    {application.candidate?.email || 'No email provided'}
                                  </p>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {application.rating && (
                                    <div className="flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-2 py-1 rounded-lg">
                                      <Star size={14} fill="currentColor" />
                                      <span className="text-sm font-medium">{application.rating}</span>
                                    </div>
                                  )}
                                  <Badge className={`${getStatusColor(application.status)} border px-3 py-1.5 text-sm font-medium`}>
                                    <div className="flex items-center gap-2">
                                      {getStatusIcon(application.status)}
                                      <span className="capitalize">{application.status.replace('_', ' ')}</span>
                                    </div>
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Application Details */}
                              <div className="space-y-3">
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar size={14} className="text-yellow-400" />
                                    <span>Applied {new Date(application.appliedAt || application.createdAt || Date.now()).toLocaleDateString()}</span>
                                  </div>
                                  {application.candidate?.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin size={14} className="text-green-400" />
                                      <span>{application.candidate.location}</span>
                                    </div>
                                  )}
                                  {application.candidate?.experienceYears && (
                                    <div className="flex items-center gap-1">
                                      <Briefcase size={14} className="text-blue-400" />
                                      <span>{application.candidate.experienceYears} years exp</span>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Skills */}
                                {application.candidate?.skills && application.candidate.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {application.candidate.skills.slice(0, 4).map((skill, index) => (
                                      <Badge key={index} variant="outline" className="text-xs border-white/20 text-white/70 bg-white/5">
                                        {skill}
                                      </Badge>
                                    ))}
                                    {application.candidate.skills.length > 4 && (
                                      <Badge variant="outline" className="text-xs border-white/20 text-white/70 bg-white/5">
                                        +{application.candidate.skills.length - 4} more
                                      </Badge>
                                    )}
                                  </div>
                                )}
                                
                                {/* Action Buttons */}
                                <div className="flex items-center justify-between pt-2">
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 transition-all"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        localStorage.setItem('selectedApplication', JSON.stringify(application));
                                        navigate(`/candidate-details/${application._id}`);
                                      }}
                                    >
                                      <Eye size={14} className="mr-1" />
                                      View Details
                                    </Button>
                                    
                                    {application.status !== 'shortlisted' && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 transition-all"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleUpdateStatus(application._id, 'shortlisted');
                                        }}
                                      >
                                        <Star size={14} className="mr-1" />
                                        Shortlist
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applicant Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedApplicant ? (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <User size={18} className="text-green-400" />
                    Applicant Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-3">
                      {selectedApplicant.candidate?.fullName && typeof selectedApplicant.candidate.fullName === 'string' ? selectedApplicant.candidate.fullName.split(' ').map(n => n[0]).join('') : 'U'}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{selectedApplicant.candidate?.fullName || 'Unknown Candidate'}</h3>
                    <p className="text-gray-400">{selectedApplicant.candidate?.experienceYears || 0} years experience</p>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-blue-400" />
                      <span className="text-white text-sm">{selectedApplicant.email || selectedApplicant.candidate?.email || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-green-400" />
                      <span className="text-white text-sm">{selectedApplicant.phone || selectedApplicant.candidate?.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-purple-400" />
                      <span className="text-white text-sm">{selectedApplicant.location || selectedApplicant.candidate?.location || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-yellow-400" />
                      <span className="text-white text-sm">Applied {new Date(selectedApplicant.appliedAt).toLocaleDateString()}</span>
                    </div>
                    {selectedApplicant.currentPosition && (
                      <div className="flex items-center gap-3">
                        <Briefcase size={16} className="text-orange-400" />
                        <span className="text-white text-sm">{selectedApplicant.currentPosition}</span>
                      </div>
                    )}
                    {selectedApplicant.currentCompany && (
                      <div className="flex items-center gap-3">
                        <Building2 size={16} className="text-cyan-400" />
                        <span className="text-white text-sm">{selectedApplicant.currentCompany}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-white/10" />

                  <div>
                    <h4 className="text-white font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {(selectedApplicant.skills && selectedApplicant.skills.length > 0) ? selectedApplicant.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300 bg-purple-500/10">
                          {skill}
                        </Badge>
                      )) : (selectedApplicant.candidate?.skills?.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-purple-500/30 text-purple-300 bg-purple-500/10">
                          {skill}
                        </Badge>
                      )) || <span className="text-gray-400 text-sm">No skills listed</span>)}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div>
                    <h4 className="text-white font-semibold mb-2">Additional Information</h4>
                    <div className="space-y-2 text-sm">
                      {selectedApplicant.candidate?.education && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Education:</span>
                          <span className="text-white">{selectedApplicant.candidate.education}</span>
                        </div>
                      )}
                      {selectedApplicant.candidate?.currentCompany && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Company:</span>
                          <span className="text-white">{selectedApplicant.candidate.currentCompany}</span>
                        </div>
                      )}
                      {selectedApplicant.candidate?.currentPosition && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Current Position:</span>
                          <span className="text-white">{selectedApplicant.candidate.currentPosition}</span>
                        </div>
                      )}
                      {selectedApplicant.candidate?.availability && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Availability:</span>
                          <span className="text-white">{selectedApplicant.candidate.availability}</span>
                        </div>
                      )}
                      {selectedApplicant.candidate?.expectedSalary && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Expected Salary:</span>
                          <span className="text-white">{selectedApplicant.candidate.expectedSalary}</span>
                        </div>
                      )}
                      {selectedApplicant.candidate?.noticePeriod && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Notice Period:</span>
                          <span className="text-white">{selectedApplicant.candidate.noticePeriod}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div>
                    <h4 className="text-white font-semibold mb-2">Cover Letter</h4>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedApplicant.coverLetter || 'No cover letter provided'}
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Additional Candidate Information */}
                  <div>
                    <h4 className="text-white font-semibold mb-2">Additional Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Education:</span>
                        <span className="text-white">{selectedApplicant.candidate?.education || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Company:</span>
                        <span className="text-white">{selectedApplicant.candidate?.currentCompany || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Position:</span>
                        <span className="text-white">{selectedApplicant.candidate?.currentPosition || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Availability:</span>
                        <span className="text-white">{selectedApplicant.candidate?.availability || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expected Salary:</span>
                        <span className="text-white">{selectedApplicant.candidate?.expectedSalary || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Notice Period:</span>
                        <span className="text-white">{selectedApplicant.candidate?.noticePeriod || 'Not specified'}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-2">
                    {/* View Resume Button */}
                    {(() => {
                      const url = selectedApplicant.resumeFile?.fileUrl || selectedApplicant.resumeUrl;
                      const isValidUrl = url && 
                        !url.startsWith('/') && 
                        !url.includes('Profile%20Resume') &&
                        !url.includes('Profile Resume') &&
                        url.startsWith('http') &&
                        url.length >= 10 &&
                        !selectedApplicant.resumeFile?._invalidId && 
                        !selectedApplicant.resumeFile?._error;
                      
                      if (isValidUrl) {
                        return (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
                          >
                            <Eye size={16} className="mr-2" />
                            View Resume
                          </a>
                        );
                      }
                      return (
                        <div className="w-full bg-gray-600 text-gray-300 px-4 py-2 rounded-md flex items-center justify-center">
                          <Eye size={16} className="mr-2" />
                          Resume Not Available
                        </div>
                      );
                    })()}
                    
                    {/* Download Resume Button */}
                    {(() => {
                      const url = selectedApplicant.resumeFile?.fileUrl || selectedApplicant.resumeUrl;
                      const isValidUrl = url && 
                        !url.startsWith('/') && 
                        !url.includes('Profile%20Resume') &&
                        !url.includes('Profile Resume') &&
                        url.startsWith('http') &&
                        url.length >= 10 &&
                        !selectedApplicant.resumeFile?._invalidId && 
                        !selectedApplicant.resumeFile?._error;
                      
                      if (isValidUrl) {
                        return (
                          <a
                            href={url}
                            download={selectedApplicant.resumeFile?.fileName || selectedApplicant.resumeFileName || 'resume.pdf'}
                            className="w-full border border-white/20 hover:bg-white/10 text-white px-4 py-2 rounded-md flex items-center justify-center transition-colors"
                          >
                            <Download size={16} className="mr-2" />
                            Download Resume
                          </a>
                        );
                      }
                      return (
                        <div className="w-full border border-gray-600 text-gray-400 px-4 py-2 rounded-md flex items-center justify-center">
                          <Download size={16} className="mr-2" />
                          Download Not Available
                        </div>
                      );
                    })()}
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => handleUpdateStatus(selectedApplicant._id, 'shortlisted')}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Shortlist Candidate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleUpdateStatus(selectedApplicant._id, 'rejected')}
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject Candidate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-8 text-center">
                  <Users size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Select an Applicant</h3>
                  <p className="text-gray-400 text-sm">
                    Click on any applicant from the list to view their detailed profile and manage their application.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
        {/* Footer Attribution */}
        <div className="text-center py-8 mt-16">
          <p className="text-gray-400 text-sm">
            Made with 💗 by G.Eesaan
          </p>
        </div>
      </div>
    </main>
  );
};

export default JobApplicants;
