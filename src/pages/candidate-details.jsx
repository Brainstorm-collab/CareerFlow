import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetApplicationsByJob } from "@/api/apiApplication";
import { useGetJob } from "@/api/apiJobs";
import { useUpdateApplicationStatus } from "@/api/apiApplication";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/context/NotificationContext";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  DollarSign, Clock, Linkedin, Github, ExternalLink, Award, 
  FileText, Eye, Download, MessageSquare, Calendar, Star, X, 
  CheckCircle, AlertCircle, Building2, Users, TrendingUp, 
  Target, Zap, Globe, Heart, BookOpen, Code, Database, 
  Palette, BarChart3, Shield, Lightbulb
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import InterviewScheduler from "@/components/interview-scheduler";

const CandidateDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const { createStatusUpdateNotification } = useNotifications();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);

  // Get job details using the actual hook
  const job = useGetJob(application?.jobId);
  
  // Mutation hook for updating application status
  const updateApplicationStatus = useUpdateApplicationStatus();

  useEffect(() => {
    // Get the application from localStorage
    const storedApplication = localStorage.getItem('selectedApplication');
    if (storedApplication) {
      const parsedApp = JSON.parse(storedApplication);
      setApplication(parsedApp);
    }
      setLoading(false);
  }, [applicationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <div className="text-white text-xl">Loading candidate details...</div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} className="text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Application Not Found</h1>
          <p className="text-gray-300 mb-8">The application you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)} className="bg-purple-600 hover:bg-purple-700">
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const candidate = application.candidate;

  // Resume URL validation and processing
  const getResumeInfo = () => {
    const url = application.resumeFile?.fileUrl || application.resumeUrl;
    const isValidUrl = url && 
      !url.startsWith('/') && 
      !url.includes('Profile%20Resume') &&
      !url.includes('Profile Resume') &&
      url.startsWith('http') &&
      url.length >= 10 &&
      !application.resumeFile?._invalidId && 
      !application.resumeFile?._error;
    
    return {
      url: isValidUrl ? url : null,
      fileName: application.resumeFile?.fileName || application.resumeFileName || 'resume.pdf',
      isValid: isValidUrl,
      hasError: application.resumeFile?._invalidId || application.resumeFile?._error
    };
  };

  const resumeInfo = getResumeInfo();

  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      'pending': { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock, label: 'Applied' },
      'reviewed': { color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30', icon: CheckCircle, label: 'Reviewed' },
      'shortlisted': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Star, label: 'Shortlisted' },
      'scheduled_for_interview': { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Calendar, label: 'Scheduled for Interview' },
      'interviewed': { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: MessageSquare, label: 'Interviewed' },
      'hired': { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle, label: 'Hired' },
      'rejected': { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: X, label: 'Rejected' }
    };
    return configs[status] || configs['pending'];
  };

  const statusConfig = getStatusConfig(application.status);

  // Quick action handlers
  const handleStatusUpdate = async (newStatus) => {
    if (!application?._id) {
      showError("Application ID not found");
      return;
    }

    setActionLoading(true);
    try {
      await updateApplicationStatus({
        applicationId: application._id,
        status: newStatus,
        notes: `Status updated to ${newStatus} by ${user?.fullName || 'Recruiter'}`
      });
      
      // Update local application state
      setApplication(prev => ({
        ...prev,
        status: newStatus,
        updatedAt: Date.now()
      }));
      
      // Create notification for status update
      createStatusUpdateNotification({
        _id: application._id,
        candidateName: application.candidate?.fullName || 'Candidate',
        jobTitle: job?.title || 'Job',
        companyName: job?.company?.name || 'Company'
      }, newStatus);
      
      showSuccess(`Application ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating application status:", error);
      showError("Failed to update application status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (candidate?.email) {
      // Open Gmail compose with the candidate's email
      const subject = `Regarding your application for ${job?.title || 'the position'}`;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(candidate.email)}&su=${encodeURIComponent(subject)}`;
      window.open(gmailUrl, '_blank');
      showSuccess("Opening Gmail to compose message...");
    } else {
      showError("Candidate email not available");
    }
  };

  const handleScheduleInterview = () => {
    setShowInterviewScheduler(true);
  };

  const handleInterviewScheduled = (interviewData) => {
    // Update application status to scheduled_for_interview
    handleStatusUpdate('scheduled_for_interview');
    
    // Store interview data (in a real app, this would be saved to database)
    const existingInterviews = JSON.parse(localStorage.getItem('scheduledInterviews') || '[]');
    existingInterviews.push(interviewData);
    localStorage.setItem('scheduledInterviews', JSON.stringify(existingInterviews));
    
    showSuccess(`Interview scheduled for ${new Date(interviewData.scheduledDate).toLocaleDateString()}`);
  };

  const handleViewResume = () => {
    if (resumeInfo.isValid && resumeInfo.url) {
      window.open(resumeInfo.url, '_blank');
    } else {
      showError("Resume not available for viewing");
    }
  };

  const handleDownloadResume = () => {
    if (resumeInfo.isValid && resumeInfo.url) {
      const link = document.createElement('a');
      link.href = resumeInfo.url;
      link.download = resumeInfo.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess("Resume download started");
    } else {
      showError("Resume not available for download");
    }
  };

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

      {/* Enhanced Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
                className="text-white hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft size={20} className="mr-2" />
                Back to Applications
            </Button>
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Candidate Profile</h1>
                <p className="text-gray-300 text-lg">Comprehensive candidate review and application details</p>
            </div>
          </div>
            <div className="flex items-center gap-4">
              <Badge className={`${statusConfig.color} border px-6 py-3 text-sm font-semibold`}>
                <statusConfig.icon size={16} className="mr-2" />
                {statusConfig.label}
            </Badge>
              <div className="text-right">
                <div className="text-sm text-gray-400">Applied</div>
                <div className="text-white font-semibold">
                  {new Date(application.appliedAt || application.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Candidate Profile Card */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex items-start gap-8">
                  <div className="relative">
                    <div className="w-24 h-24 border-3 border-purple-500/50 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      {candidate?.profileImageUrl ? (
                        <img 
                          src={candidate.profileImageUrl} 
                          alt={candidate?.fullName || 'Candidate'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {candidate?.fullName?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle size={16} className="text-white" />
                    </div>
                    </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                    <div>
                        <CardTitle className="text-3xl text-white mb-2">
                        {candidate?.fullName || 'Unknown Candidate'}
                      </CardTitle>
                        <div className="flex items-center gap-6 text-gray-300 mb-4">
                          <div className="flex items-center gap-2">
                            <Mail size={18} />
                            <span className="font-medium">{candidate?.email || 'No email'}</span>
                    </div>
                          {candidate?.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={18} />
                              <span className="font-medium">{candidate.phone}</span>
                  </div>
                          )}
                  </div>
                        <div className="flex items-center gap-6 text-gray-300">
                          {candidate?.location && (
                            <div className="flex items-center gap-2">
                              <MapPin size={18} />
                              <span className="font-medium">{candidate.location}</span>
                </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Briefcase size={18} />
                            <span className="font-medium">{candidate?.experienceYears || 0} years experience</span>
                    </div>
                    </div>
                    </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

                {/* Professional Summary */}
            {candidate?.bio && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3 text-xl">
                    <User size={24} />
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed text-lg">{candidate.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Skills & Expertise */}
            {candidate?.skills && candidate.skills.length > 0 && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3 text-xl">
                    <Award size={24} />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm font-medium">
                        {skill}
                      </Badge>
                    ))}
                        </div>
                </CardContent>
              </Card>
            )}

            {/* Application Details */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <FileText size={24} />
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 font-medium">Applied Date</label>
                      <p className="text-white text-lg font-semibold">
                        {new Date(application.appliedAt || application.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {Math.floor((Date.now() - (application.appliedAt || application.createdAt)) / (1000 * 60 * 60 * 24))} days ago
                      </p>
                        </div>
                    <div>
                      <label className="text-sm text-gray-400 font-medium">Current Status</label>
                      <p className="text-white text-lg font-semibold">{application.status || 'Applied'}</p>
                      </div>
                    </div>
                  <div className="space-y-4">
                    {application.expectedSalary && (
                      <div>
                        <label className="text-sm text-gray-400 font-medium">Expected Salary</label>
                        <p className="text-white text-lg font-semibold">${application.expectedSalary.toLocaleString()}</p>
                  </div>
                    )}
                    {application.noticePeriod && (
                      <div>
                        <label className="text-sm text-gray-400 font-medium">Notice Period</label>
                        <p className="text-white text-lg font-semibold">{application.noticePeriod}</p>
                </div>
                    )}
                  </div>
                </div>

                {application.coverLetter && (
                <div>
                    <label className="text-sm text-gray-400 font-medium mb-3 block">Cover Letter</label>
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                        {application.coverLetter}
                    </p>
                  </div>
                </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Resume */}
          <div className="space-y-6">
            {/* Resume Section */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <FileText size={24} />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resumeInfo.isValid ? (
                  <>
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <CheckCircle size={16} />
                        <span className="font-medium">Resume Available</span>
                      </div>
                      <p className="text-sm text-gray-300">{resumeInfo.fileName}</p>
                </div>
                
                    <Button
                      onClick={handleViewResume}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <Eye size={20} className="mr-3" />
                      View Resume
                    </Button>
                    
                    <Button
                      onClick={handleDownloadResume}
                      variant="outline"
                      className="w-full border-2 border-white/20 hover:bg-white/10 text-white px-6 py-4 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
                    >
                      <Download size={20} className="mr-3" />
                      Download Resume
                    </Button>
                  </>
                ) : resumeInfo.hasError ? (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <AlertCircle size={16} />
                      <span className="font-medium">Resume Corrupted</span>
                    </div>
                    <p className="text-sm text-gray-300">The resume file appears to be corrupted or invalid.</p>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-500/10 border border-gray-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <AlertCircle size={16} />
                      <span className="font-medium">No Resume Available</span>
                    </div>
                    <p className="text-sm text-gray-300">This candidate hasn't uploaded a resume.</p>
                </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleStatusUpdate('shortlisted')}
                  disabled={actionLoading || application?.status === 'shortlisted'}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Star size={20} className="mr-3" />
                  {application?.status === 'shortlisted' ? 'Shortlisted' : 'Shortlist Candidate'}
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  variant="outline" 
                  className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <MessageSquare size={20} className="mr-3" />
                  Send Message
                </Button>
                <Button 
                  onClick={handleScheduleInterview}
                  variant="outline" 
                  className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
                >
                  <Calendar size={20} className="mr-3" />
                  Schedule Interview
                </Button>
                <Button 
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={actionLoading || application?.status === 'rejected'}
                  variant="outline" 
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X size={20} className="mr-3" />
                  {application?.status === 'rejected' ? 'Rejected' : 'Reject Application'}
                </Button>
                
                {/* Additional status options */}
                {application?.status === 'pending' && (
                  <Button 
                    onClick={() => handleStatusUpdate('reviewed')}
                    disabled={actionLoading || application?.status === 'reviewed'}
                    variant="outline"
                    className="w-full border-indigo-500/50 text-indigo-400 hover:bg-indigo-500/10 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={20} className="mr-3" />
                    {application?.status === 'reviewed' ? 'Reviewed' : 'Mark as Reviewed'}
                  </Button>
                )}
                
                {application?.status === 'scheduled_for_interview' && (
                  <Button 
                    onClick={() => handleStatusUpdate('interviewed')}
                    disabled={actionLoading || application?.status === 'interviewed'}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MessageSquare size={20} className="mr-3" />
                    {application?.status === 'interviewed' ? 'Interview Completed' : 'Mark Interview Complete'}
                  </Button>
                )}
                
                {application?.status === 'shortlisted' && (
                  <Button 
                    onClick={() => handleStatusUpdate('hired')}
                    disabled={actionLoading || application?.status === 'hired'}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle size={20} className="mr-3" />
                    {application?.status === 'hired' ? 'Hired' : 'Mark as Hired'}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            {(candidate?.linkedinUrl || candidate?.githubUrl || candidate?.portfolioUrl) && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl">
              <CardHeader>
                  <CardTitle className="text-white text-xl">Social Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                  {candidate?.linkedinUrl && (
                    <a
                      href={candidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <Linkedin size={24} className="text-blue-400" />
                      <span className="text-white font-medium">LinkedIn Profile</span>
                      <ExternalLink size={16} className="text-gray-400 ml-auto" />
                    </a>
                  )}
                  {candidate?.githubUrl && (
                    <a
                      href={candidate.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <Github size={24} className="text-gray-400" />
                      <span className="text-white font-medium">GitHub Profile</span>
                      <ExternalLink size={16} className="text-gray-400 ml-auto" />
                    </a>
                  )}
                  {candidate?.portfolioUrl && (
                    <a
                      href={candidate.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      <Globe size={24} className="text-purple-400" />
                      <span className="text-white font-medium">Portfolio Website</span>
                      <ExternalLink size={16} className="text-gray-400 ml-auto" />
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Job Information */}
            {job && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Applied Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">{job.title}</h3>
                      <p className="text-gray-300">{job.company?.name || 'Company'}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={16} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Briefcase size={16} />
                      <span>{job.jobType}</span>
                    </div>
                  </div>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </div>

      {/* Interview Scheduler Modal */}
      <InterviewScheduler
        isOpen={showInterviewScheduler}
        onClose={() => setShowInterviewScheduler(false)}
        candidate={candidate}
        job={job}
        onSchedule={handleInterviewScheduled}
      />
    </div>
  );
};

export default CandidateDetails;
