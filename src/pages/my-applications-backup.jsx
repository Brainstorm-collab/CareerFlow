import JobCard from "@/components/job-card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, User, MapPin, Building2, DollarSign, Calendar, X, ArrowRight, TrendingUp, Star, Eye, Download, ExternalLink, Trash2, AlertTriangle, Mail, Phone, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useJobContext } from "@/context/JobContext";
import { Link, useNavigate } from "react-router-dom";
import { useGetApplicationsByCandidate, useWithdrawApplication, useDebugApplicationData, useDebugAllJobs } from "@/api/apiApplication";

const MyApplications = () => {
  const { isLoading, user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { getAppliedJobsData } = useJobContext();
  const withdrawApplication = useWithdrawApplication();
  const navigate = useNavigate();
  
  // Use Convex hook to get applications
  const applications = useGetApplicationsByCandidate(user?.id);
  
  // Debug hook to check application data
  const debugData = useDebugApplicationData(user?.id);
  const allJobsDebug = useDebugAllJobs();
  
  // Debug logging (temporarily enabled)
  console.log('MyApplications - applications length:', applications?.length);
  
  // Debug individual application data
  if (applications && applications.length > 0) {
    console.log('MyApplications - First application job:', applications[0]?.job);
    console.log('MyApplications - First application company:', applications[0]?.company);
  }
  
  // State for withdraw dialog
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [applicationToWithdraw, setApplicationToWithdraw] = useState(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // Loading state from Convex
  const loading = applications === undefined;

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-500/20 text-yellow-300', icon: Clock, label: 'Pending' };
      case 'reviewed':
        return { color: 'bg-blue-500/20 text-blue-300', icon: FileText, label: 'Under Review' };
      case 'shortlisted':
        return { color: 'bg-green-500/20 text-green-300', icon: CheckCircle, label: 'Shortlisted' };
      case 'rejected':
        return { color: 'bg-red-500/20 text-red-300', icon: X, label: 'Rejected' };
      case 'hired':
        return { color: 'bg-emerald-500/20 text-emerald-300', icon: CheckCircle, label: 'Hired' };
      default:
        return { color: 'bg-gray-500/20 text-gray-300', icon: Clock, label: 'Unknown' };
    }
  };

  // Handle viewing application details - redirect to application status page
  const handleViewDetails = (application) => {
    navigate(`/application/${application._id}`, {
      state: {
        application: application,
        job: application.job,
        user: user
      }
    });
  };

  // Handle withdraw application
  const handleWithdrawClick = (application) => {
    setApplicationToWithdraw(application);
    setShowWithdrawDialog(true);
  };

  const handleWithdrawApplication = async () => {
    if (!applicationToWithdraw || !user) {
      showError('Unable to withdraw application');
      return;
    }

    setIsWithdrawing(true);
    
    try {
      await withdrawApplication({
        applicationId: applicationToWithdraw._id,
        socialId: user.id,
      });
      
      showSuccess('Application withdrawn successfully');
      setShowWithdrawDialog(false);
      setApplicationToWithdraw(null);
    } catch (error) {
      console.error('Error withdrawing application:', error);
      showError('Failed to withdraw application. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date unavailable';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Date unavailable';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date unavailable';
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-12 text-center">
              <User size={48} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold text-white mb-2">Please sign in</h2>
              <p className="text-gray-400 mb-6">You need to be signed in to view your applications.</p>
              <Link to="/sign-in" className="inline-block">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Sign In
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
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
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Modern Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <FileText size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">My Applications</h1>
                <p className="text-gray-300 text-lg">Track and manage your job applications</p>
              </div>
            </div>
            
            {/* Stats Cards */}
            {applications && applications.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 backdrop-blur-sm border-blue-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <FileText size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">{applications.length}</p>
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
                        <p className="text-2xl font-bold text-white">
                          {applications.filter(app => app.status === 'pending').length}
                        </p>
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
                        <p className="text-2xl font-bold text-white">
                          {applications.filter(app => app.status === 'shortlisted' || app.status === 'hired').length}
                        </p>
                        <p className="text-green-300 text-sm">Shortlisted</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 backdrop-blur-sm border-purple-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <TrendingUp size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {applications.filter(app => app.status === 'reviewed').length}
                        </p>
                        <p className="text-purple-300 text-sm">Under Review</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
        </div>

        {/* Applications List */}
        {applications && applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => {
              const statusInfo = getStatusInfo(application.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                  <Card key={application._id} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        
                      {/* Job Info */}
                      <div className="flex-1">
                          <div className="flex items-start gap-6">
                            {/* Company Logo - Raw Image */}
                            {(() => {
                              const company = application.company;
                              const companyName = company?.name || company;
                              
                              // Debug logging
                              console.log('Logo Debug - Company:', company);
                              console.log('Logo Debug - Company Name:', companyName);
                              console.log('Logo Debug - Company LogoUrl:', company?.logoUrl);
                              
                              // First try logoUrl from database
                              if (company?.logoUrl) {
                                console.log('Using database logoUrl:', company.logoUrl);
                                return (
                                  <img 
                                    src={company.logoUrl} 
                                    alt={companyName}
                                    className="w-20 h-20 object-contain"
                                    onError={(e) => {
                                      console.log('Logo failed to load, using default');
                                      e.target.src = '/companies/default.svg';
                                    }}
                                  />
                                );
                              }
                              
                              // Fallback to logo mapping based on company name
                              if (companyName) {
                                const normalizedName = companyName.toLowerCase().trim();
                                console.log('Normalized company name:', normalizedName);
                                
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
                                  'krafton gaming union': '/companies/default.svg',
                                  'krafton': '/companies/default.svg',
                                };
                                
                                const logoPath = logoMap[normalizedName];
                                console.log('Logo path found:', logoPath);
                                
                                if (logoPath) {
                                  return (
                                    <img 
                                      src={logoPath} 
                                      alt={companyName}
                                      className="w-20 h-20 object-contain"
                                      onError={(e) => {
                                        console.log('Mapped logo failed to load, using default');
                                        e.target.src = '/companies/default.svg';
                                      }}
                                    />
                                  );
                                }
                              }
                              
                              // Final fallback to default icon
                              console.log('Using default building icon');
                              return <Building2 size={32} className="text-gray-400" />;
                            })()}
                          
                          {/* Job Details */}
                          <div className="flex-1 min-w-0">
                              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                              {application.job?.title || 'Job Title Not Available'}
                            </h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Building2 size={18} className="text-blue-400" />
                                  <span className="font-medium">{application.company?.name || application.job?.company?.name || 'Company Not Available'}</span>
                              </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                  <MapPin size={18} className="text-green-400" />
                                <span>{application.job?.location || 'Location Not Available'}</span>
                              </div>
                              {application.job?.salaryMin && (
                                  <div className="flex items-center gap-2 text-gray-300">
                                    <DollarSign size={18} className="text-yellow-400" />
                                  <span>
                                      ${application.job.salaryMin.toLocaleString()}
                                      {application.job.salaryMax && ` - $${application.job.salaryMax.toLocaleString()}`}
                                  </span>
                                </div>
                              )}
                            </div>
                              
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Calendar size={16} className="text-purple-400" />
                                <span>Applied on {(() => {
                                  const dateValue = application.appliedAt || application.createdAt || application._creationTime;
                                  if (dateValue) {
                                    try {
                                      return new Date(dateValue).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                      });
                                    } catch (error) {
                                      return 'Date unavailable';
                                    }
                                  }
                                  return 'Date unavailable';
                                })()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                        {/* Status and Actions */}
                        <div className="flex flex-col items-end gap-4">
                          <Badge className={`${statusInfo.color} border-0 px-4 py-2 text-sm font-semibold`}>
                            <StatusIcon size={16} className="mr-2" />
                          {statusInfo.label}
                        </Badge>
                        
                        <div className="flex gap-3">
                          <button 
                            onClick={() => handleViewDetails(application)}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 group"
                          >
                            <Eye size={18} />
                            View Details
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                          
                          <button 
                            onClick={() => handleWithdrawClick(application)}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25 group"
                          >
                            <Trash2 size={18} />
                            Withdraw
                          </button>
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
                  <FileText size={48} className="text-blue-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">No Applications Yet</h2>
                <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
                  You haven't applied to any jobs yet. Start your journey by exploring amazing opportunities!
              </p>
              <Link to="/jobs">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center gap-3 mx-auto">
                    <Star size={20} />
                  Browse Jobs
                    <ArrowRight size={18} />
                </button>
              </Link>
            </CardContent>
          </Card>
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
                {/* Company Logo in Modal */}
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden">
                  {(() => {
                    const company = selectedApplication.company;
                    const companyName = company?.name || company;
                    
                    if (company?.logoUrl) {
                      return (
                        <img 
                          src={company.logoUrl} 
                          alt={companyName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      );
                    }
                    
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
                        'krafton gaming union': '/companies/default.svg',
                        'krafton': '/companies/default.svg',
                      };
                      
                      const logoPath = logoMap[normalizedName];
                      if (logoPath) {
                        return (
                          <img 
                            src={logoPath} 
                            alt={companyName}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        );
                      }
                    }
                    
                    return (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                  <FileText size={24} className="text-white" />
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Application Details</h2>
                  <p className="text-gray-400">{selectedApplication.job?.title} at {selectedApplication.company?.name || selectedApplication.job?.company?.name || selectedApplication.job?.company}</p>
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
              <Badge className={`${getStatusInfo(selectedApplication.status).color} border-0 px-4 py-2 text-sm font-semibold`}>
                {(() => {
                  const StatusIcon = getStatusInfo(selectedApplication.status).icon;
                  return <StatusIcon size={16} className="mr-2" />;
                })()}
                {getStatusInfo(selectedApplication.status).label}
              </Badge>
            </div>

            {/* Application Date */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-blue-400" />
                <div>
                  <p className="text-white font-semibold">Applied On</p>
                  <p className="text-gray-400">{formatDate(selectedApplication.appliedAt || selectedApplication.createdAt || selectedApplication._creationTime)}</p>
                </div>
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
                        : selectedApplication.resumeFileSize
                        ? `${(selectedApplication.resumeFileSize / 1024).toFixed(1)} KB`
                        : 'Uploaded with application'
                      }
                    </p>
                    {selectedApplication.resumeFileType && (
                      <p className="text-gray-500 text-xs">
                        Type: {selectedApplication.resumeFileType}
                      </p>
                    )}
                  </div>
                  {selectedApplication.resumeFile?.fileUrl ? (
                    <a
                      href={selectedApplication.resumeFile.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <ExternalLink size={16} />
                      View Resume
                    </a>
                  ) : selectedApplication.resumeUrl && !selectedApplication.resumeUrl.startsWith('file:') ? (
                    <a
                      href={selectedApplication.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      <ExternalLink size={16} />
                      View Resume
                    </a>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-gray-300 rounded-lg">
                      <FileText size={16} />
                      File Processing
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Application Summary */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={20} className="text-blue-400" />
                <h3 className="text-xl font-bold text-white">Application Summary</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Application Date</p>
                    <p className="text-gray-400">{formatDate(selectedApplication.appliedAt || selectedApplication.createdAt || selectedApplication._creationTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Status</p>
                    <p className="text-gray-400 capitalize">{selectedApplication.status || 'Pending'}</p>
                  </div>
                </div>
                {selectedApplication.resumeFileName && (
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Resume File</p>
                      <p className="text-gray-400">{selectedApplication.resumeFileName}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.resumeFileSize && (
                  <div className="flex items-center gap-3">
                    <Download size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">File Size</p>
                      <p className="text-gray-400">{(selectedApplication.resumeFileSize / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Your Profile Information (Autofilled) */}
            {user && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <User size={20} className="text-green-400" />
                  <h3 className="text-xl font-bold text-white">Your Profile Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Full Name</p>
                      <p className="text-gray-400">{user.fullName || user.name || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Email</p>
                      <p className="text-gray-400">{user.email || 'Not provided'}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Phone</p>
                        <p className="text-gray-400">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Location</p>
                        <p className="text-gray-400">{user.location}</p>
                      </div>
                    </div>
                  )}
                  {user.currentPosition && (
                    <div className="flex items-center gap-3">
                      <Briefcase size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Current Position</p>
                        <p className="text-gray-400">{user.currentPosition}</p>
                      </div>
                    </div>
                  )}
                  {user.experienceYears !== undefined && (
                    <div className="flex items-center gap-3">
                      <TrendingUp size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Experience</p>
                        <p className="text-gray-400">{user.experienceYears} years</p>
                      </div>
                    </div>
                  )}
                  {user.portfolioUrl && (
                    <div className="flex items-center gap-3">
                      <ExternalLink size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Portfolio</p>
                        <a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          View Portfolio
                        </a>
                      </div>
                    </div>
                  )}
                  {user.linkedinUrl && (
                    <div className="flex items-center gap-3">
                      <ExternalLink size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">LinkedIn</p>
                        <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Skills */}
                {user.skills && user.skills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-white font-semibold mb-2">Your Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} className="bg-green-500/20 text-green-300 border-green-500/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Bio */}
                {user.bio && (
                  <div className="mt-4">
                    <p className="text-white font-semibold mb-2">About You</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
                  </div>
                )}

                {/* Additional Profile Information */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.education && (
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Education</p>
                        <p className="text-gray-400">{user.education}</p>
                      </div>
                    </div>
                  )}
                  {user.currentCompany && (
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Current Company</p>
                        <p className="text-gray-400">{user.currentCompany}</p>
                      </div>
                    </div>
                  )}
                  {user.availability && (
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Availability</p>
                        <p className="text-gray-400">{user.availability}</p>
                      </div>
                    </div>
                  )}
                  {user.expectedSalary && (
                    <div className="flex items-center gap-3">
                      <DollarSign size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Expected Salary</p>
                        <p className="text-gray-400">{user.expectedSalary}</p>
                      </div>
                    </div>
                  )}
                  {user.noticePeriod && (
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Notice Period</p>
                        <p className="text-gray-400">{user.noticePeriod}</p>
                      </div>
                    </div>
                  )}
                  {user.githubUrl && (
                    <div className="flex items-center gap-3">
                      <ExternalLink size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">GitHub</p>
                        <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          View Profile
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Projects */}
                {user.projects && user.projects.length > 0 && (
                  <div className="mt-4">
                    <p className="text-white font-semibold mb-2">Your Projects</p>
                    <div className="space-y-2">
                      {user.projects.map((project, index) => (
                        <div key={index} className="bg-gray-900/50 rounded-lg p-3">
                          <p className="text-gray-300 text-sm">{project}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certificates */}
                {user.certificates && user.certificates.length > 0 && (
                  <div className="mt-4">
                    <p className="text-white font-semibold mb-2">Certificates</p>
                    <div className="flex flex-wrap gap-2">
                      {user.certificates.map((cert, index) => (
                        <Badge key={index} className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                          {cert}
                        </Badge>
                      ))}
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
                    <p className="text-gray-400">{selectedApplication.job?.location || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Job Type</p>
                    <p className="text-gray-400 capitalize">{selectedApplication.job?.jobType?.replace('-', ' ') || 'Not specified'}</p>
                  </div>
                </div>
                {selectedApplication.job?.salaryMin && (
                  <div className="flex items-center gap-3">
                    <DollarSign size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Salary</p>
                      <p className="text-gray-400">
                        ${selectedApplication.job.salaryMin.toLocaleString()}
                        {selectedApplication.job.salaryMax && ` - $${selectedApplication.job.salaryMax.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <TrendingUp size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Experience Level</p>
                    <p className="text-gray-400 capitalize">{selectedApplication.job?.experienceLevel || 'Not specified'}</p>
                  </div>
                </div>
                {selectedApplication.job?.remotePolicy && (
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Remote Policy</p>
                      <p className="text-gray-400 capitalize">{selectedApplication.job.remotePolicy}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.job?.employmentType && (
                  <div className="flex items-center gap-3">
                    <Briefcase size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Employment Type</p>
                      <p className="text-gray-400 capitalize">{selectedApplication.job.employmentType}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.job?.department && (
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Department</p>
                      <p className="text-gray-400">{selectedApplication.job.department}</p>
                    </div>
                  </div>
                )}
                {selectedApplication.job?.applicationDeadline && (
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Application Deadline</p>
                      <p className="text-gray-400">{formatDate(selectedApplication.job.applicationDeadline)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            {selectedApplication.job?.description && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={20} className="text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Job Description</h3>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedApplication.job.description}
                  </p>
                </div>
              </div>
            )}

            {/* Job Requirements */}
            {selectedApplication.job?.requirements && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={20} className="text-green-400" />
                  <h3 className="text-xl font-bold text-white">Job Requirements</h3>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedApplication.job.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Required Skills */}
            {selectedApplication.job?.skillsRequired && selectedApplication.job.skillsRequired.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star size={20} className="text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Required Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.job.skillsRequired.map((skill, index) => (
                    <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Skills */}
            {selectedApplication.job?.skillsPreferred && selectedApplication.job.skillsPreferred.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Star size={20} className="text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Preferred Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.job.skillsPreferred.map((skill, index) => (
                    <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Job Benefits */}
            {selectedApplication.job?.benefits && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={20} className="text-green-400" />
                  <h3 className="text-xl font-bold text-white">Benefits</h3>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {selectedApplication.job.benefits}
                  </p>
                </div>
              </div>
            )}

            {/* Company Information */}
            {selectedApplication.company && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 size={20} className="text-blue-400" />
                  <h3 className="text-xl font-bold text-white">Company Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Company Name</p>
                      <p className="text-gray-400">{selectedApplication.company.name}</p>
                    </div>
                  </div>
                  {selectedApplication.company.industry && (
                    <div className="flex items-center gap-3">
                      <TrendingUp size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Industry</p>
                        <p className="text-gray-400">{selectedApplication.company.industry}</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.company.companySize && (
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Company Size</p>
                        <p className="text-gray-400">{selectedApplication.company.companySize}</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.company.headquarters && (
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Headquarters</p>
                        <p className="text-gray-400">{selectedApplication.company.headquarters}</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.company.foundedYear && (
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Founded</p>
                        <p className="text-gray-400">{selectedApplication.company.foundedYear}</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.company.websiteUrl && (
                    <div className="flex items-center gap-3">
                      <ExternalLink size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Website</p>
                        <a href={selectedApplication.company.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                          Visit Website
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Company Description */}
                {selectedApplication.company.description && (
                  <div className="mt-4">
                    <p className="text-white font-semibold mb-2">About the Company</p>
                    <div className="bg-gray-900/50 rounded-lg p-4">
                      <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {selectedApplication.company.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Company Benefits */}
                {selectedApplication.company.benefits && selectedApplication.company.benefits.length > 0 && (
                  <div className="mt-4">
                    <p className="text-white font-semibold mb-2">Company Benefits</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.company.benefits.map((benefit, index) => (
                        <Badge key={index} className="bg-green-500/20 text-green-300 border-green-500/30">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Company Culture Tags */}
                {selectedApplication.company.cultureTags && selectedApplication.company.cultureTags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-white font-semibold mb-2">Company Culture</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.company.cultureTags.map((tag, index) => (
                        <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Job Application Timeline */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock size={20} className="text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Application Timeline</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div>
                    <p className="text-white font-semibold">Application Submitted</p>
                    <p className="text-gray-400">{formatDate(selectedApplication.appliedAt || selectedApplication.createdAt || selectedApplication._creationTime)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="text-white font-semibold">Status: {selectedApplication.status || 'Pending Review'}</p>
                    <p className="text-gray-400">Your application is being reviewed by the hiring team</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <div>
                    <p className="text-white font-semibold">Next Steps</p>
                    <p className="text-gray-400">Awaiting response from the company</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Posting Metadata */}
            {selectedApplication.job && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileText size={20} className="text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Job Posting Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Job ID</p>
                      <p className="text-gray-400 font-mono text-sm">{selectedApplication.job._id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Job Posted</p>
                      <p className="text-gray-400">{formatDate(selectedApplication.job.createdAt || selectedApplication.job._creationTime)}</p>
                    </div>
                  </div>
                  {selectedApplication.job.updatedAt && (
                    <div className="flex items-center gap-3">
                      <TrendingUp size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Last Updated</p>
                        <p className="text-gray-400">{formatDate(selectedApplication.job.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  {selectedApplication.job.isActive !== undefined && (
                    <div className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-gray-400" />
                      <div>
                        <p className="text-white font-semibold">Job Status</p>
                        <p className="text-gray-400">{selectedApplication.job.isActive ? 'Active' : 'Inactive'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Application Metadata */}
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText size={20} className="text-gray-400" />
                <h3 className="text-xl font-bold text-white">Application Metadata</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Application ID</p>
                    <p className="text-gray-400 font-mono text-sm">{selectedApplication._id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Created At</p>
                    <p className="text-gray-400">{formatDate(selectedApplication._creationTime)}</p>
                  </div>
                </div>
                {selectedApplication.updatedAt && (
                  <div className="flex items-center gap-3">
                    <TrendingUp size={16} className="text-gray-400" />
                    <div>
                      <p className="text-white font-semibold">Last Updated</p>
                      <p className="text-gray-400">{formatDate(selectedApplication.updatedAt)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <User size={16} className="text-gray-400" />
                  <div>
                    <p className="text-white font-semibold">Candidate ID</p>
                    <p className="text-gray-400 font-mono text-sm">{selectedApplication.candidateId}</p>
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
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-colors"
              >
                Close
              </button>
              <Link to={`/job/${selectedApplication.job?._id}`}>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300">
                  View Job Posting
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Withdraw Confirmation Dialog */}
    {showWithdrawDialog && applicationToWithdraw && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowWithdrawDialog(false)} />
        
        {/* Dialog */}
        <div className="relative bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Withdraw Application</h3>
          </div>
          
          <p className="text-gray-300 mb-6">
            Are you sure you want to withdraw your application for <strong className="text-white">{applicationToWithdraw.job?.title}</strong> at <strong className="text-white">{applicationToWithdraw.job?.company?.name || (typeof applicationToWithdraw.job?.company === 'string' ? applicationToWithdraw.job?.company : 'Company')}</strong>?
          </p>
          
          <p className="text-gray-400 text-sm mb-6">
            This action cannot be undone. You will need to reapply if you change your mind.
          </p>
          
          <div className="flex gap-3">
            <Button
              onClick={() => setShowWithdrawDialog(false)}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700/50"
              disabled={isWithdrawing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdrawApplication}
              disabled={isWithdrawing}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isWithdrawing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Withdrawing...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Withdraw
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default MyApplications;
