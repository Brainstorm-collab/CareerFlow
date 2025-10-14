import JobCard from "@/components/job-card";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, User, MapPin, Building2, DollarSign, Calendar, X, ArrowRight, TrendingUp, Star, Eye, Download, ExternalLink, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useJobContext } from "@/context/JobContext";
import { Link, useNavigate } from "react-router-dom";
import { useGetApplicationsByCandidate, useWithdrawApplication } from "@/api/apiApplication";
import { useGetFilesByUser } from "@/api/apiFileStorage";

const MyApplications = () => {
  const { isLoading, user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { getAppliedJobsData } = useJobContext();
  const withdrawApplication = useWithdrawApplication();
  const navigate = useNavigate();
  const userFiles = useGetFilesByUser(user?.id);
  
  // Use Convex hook to get applications
  const applications = useGetApplicationsByCandidate(user?.id);
  
  // Debug logging (temporarily enabled)
  console.log('MyApplications - user:', user);
  console.log('MyApplications - user?.id:', user?.id);
  console.log('MyApplications - applications:', applications);
  console.log('MyApplications - applications length:', applications?.length);
  
  // Debug individual application data
  if (applications && applications.length > 0) {
    console.log('MyApplications - First application:', applications[0]);
    console.log('MyApplications - First application job:', applications[0]?.job);
    console.log('MyApplications - First application company:', applications[0]?.company);
  }
  
  // State for withdraw dialog only
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
      case 'scheduled_for_interview':
        return { color: 'bg-purple-500/20 text-purple-300', icon: Calendar, label: 'Interview Scheduled' };
      case 'interviewed':
        return { color: 'bg-indigo-500/20 text-indigo-300', icon: CheckCircle, label: 'Interviewed' };
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
    // Determine resume URL - use application resume, then user's uploaded files, then fallback
    let resumeUrl = application.resumeUrl;
    let resumeFileName = 'Resume.pdf';
    
    if (!resumeUrl || !resumeUrl.startsWith('http')) {
      // Try to use the most recent uploaded resume file
      if (userFiles && userFiles.length > 0) {
        const pdfFiles = userFiles.filter(file => file.fileType.includes('pdf'));
        if (pdfFiles.length > 0) {
          const mostRecentFile = pdfFiles.sort((a, b) => b.uploadedAt - a.uploadedAt)[0];
          resumeUrl = mostRecentFile.downloadUrl;
          resumeFileName = mostRecentFile.fileName;
        }
      }
    }
    
    // Create application data for the status page
    const applicationData = {
      _id: application._id,
      status: application.status || 'submitted',
      createdAt: application.appliedAt || application.createdAt || application._creationTime,
      appliedAt: application.appliedAt || application.createdAt || application._creationTime,
      coverLetter: application.coverLetter,
      resumeUrl: resumeUrl,
      resumeFileName: resumeFileName,
      candidateId: application.candidateId,
      jobId: application.jobId,
      // Use application data first, then fall back to user profile data
      fullName: application.fullName || user?.name || 'User',
      email: application.email || user?.email || '',
      phone: application.phone || user?.phone || '',
      location: application.location || user?.location || '',
      experienceYears: application.experienceYears || user?.experienceYears || 0,
      currentPosition: application.currentPosition || user?.currentPosition || '',
      currentCompany: application.currentCompany || user?.currentCompany || '',
      skills: application.skills || user?.skills || [],
      education: application.education || user?.education || '',
      availability: application.availability || user?.availability || '',
      expectedSalary: application.expectedSalary || user?.expectedSalary || '',
      noticePeriod: application.noticePeriod || user?.noticePeriod || ''
    };
    
    // Navigate to application status page
    navigate(`/application-status/${application._id}`, {
      state: {
        application: applicationData,
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
                              const company = application.job?.company;
                              const companyName = company?.name || company;
                              
                              // First try logoUrl from database
                              if (company?.logoUrl) {
                                return (
                                  <img 
                                    src={company.logoUrl} 
                                    alt={companyName}
                                    className="w-20 h-20 object-contain"
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
                                      className="w-20 h-20 object-contain"
                                      onError={(e) => {
                                        e.target.src = '/companies/default.svg';
                                      }}
                                    />
                                  );
                                }
                              }
                              
                              // Final fallback to default icon
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
                                  <span className="font-medium">{application.job?.company?.name || 'Company Not Available'}</span>
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
