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

  // Handle withdraw confirmation
  const handleWithdrawConfirm = async () => {
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

  // Format date helper
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in</h1>
          <p className="text-gray-300 mb-6">You need to be signed in to view your applications.</p>
          <Link to="/auth">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Blur Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            My Applications
          </h1>
          <p className="text-gray-300 text-xl">
            Track and manage your job applications
          </p>
        </div>

        {/* Applications List */}
        {applications && applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => {
              const statusInfo = getStatusInfo(application.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={application._id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Company Logo */}
                      <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {(() => {
                          const company = application.company;
                          const companyName = company?.name || company;
                          console.log('Logo Debug - Company:', company);
                          console.log('Logo Debug - Company Name:', companyName);
                          console.log('Logo Debug - Company LogoUrl:', company?.logoUrl);
                          
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
                          
                          console.log('Using default building icon');
                          return (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                              <Building2 size={24} className="text-white" />
                            </div>
                          );
                        })()}
                      </div>

                      {/* Application Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white mb-2 truncate">
                              {application.job?.title || 'Job Title Not Available'}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-300 mb-2">
                              <Building2 size={16} />
                              <span className="font-medium">{application.company?.name || application.job?.company?.name || 'Company Not Available'}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <MapPin size={14} />
                                <span>{application.job?.location || 'Location not specified'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>Applied {formatDate(application.appliedAt || application.createdAt || application._creationTime)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:items-end gap-3">
                            <Badge className={`${statusInfo.color} border-0 px-3 py-1 text-sm font-semibold`}>
                              <StatusIcon size={14} className="mr-2" />
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Applications Yet</h2>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              You haven't applied to any jobs yet. Start exploring opportunities and apply to positions that match your skills.
            </p>
            <Link to="/jobs">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                Browse Jobs
              </Button>
            </Link>
          </div>
        )}
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
              Are you sure you want to withdraw your application for <strong className="text-white">{applicationToWithdraw.job?.title}</strong> at <strong className="text-white">{applicationToWithdraw.company?.name || applicationToWithdraw.job?.company?.name || 'Company'}</strong>?
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
                onClick={handleWithdrawConfirm}
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
    </div>
  );
};

export default MyApplications;
