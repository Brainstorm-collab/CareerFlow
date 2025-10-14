import { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useWithdrawApplication } from "@/api/apiApplication";
import { 
  CheckCircle, 
  Clock, 
  User, 
  Building2, 
  MapPin, 
  Calendar,
  FileText,
  Mail,
  Phone,
  Award,
  Briefcase,
  ArrowLeft,
  Download,
  ExternalLink,
  X,
  Trash2,
  AlertTriangle,
  Eye,
  FileCheck,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Bell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ApplicationStatusPage = () => {
  const { applicationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const withdrawApplication = useWithdrawApplication();
  
  const [application, setApplication] = useState(null);
  const [job, setJob] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [interviewDetails, setInterviewDetails] = useState(null);
  
  useEffect(() => {
    if (location.state) {
      setApplication(location.state.application);
      setJob(location.state.job);
      setUserData(location.state.user);
    }
    
    // Load interview details if application has interview status
    const loadInterviewDetails = () => {
      const scheduledInterviews = JSON.parse(localStorage.getItem('scheduledInterviews') || '[]');
      if (application && (application.status === 'scheduled_for_interview' || application.status === 'interviewed')) {
        const interview = scheduledInterviews.find(interview => 
          interview.candidateId === application.candidateId && 
          interview.jobId === application.jobId
        );
        if (interview) {
          setInterviewDetails(interview);
        }
      }
    };
    
    loadInterviewDetails();
  }, [location.state, application]);

  if (!application || !job || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Application Not Found</h1>
          <p className="text-gray-300 mb-6">The application you're looking for doesn't exist.</p>
          <Link to="/jobs">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowLeft size={16} className="mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
      case 'pending':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      case 'under_review':
      case 'reviewed':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'shortlisted':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'scheduled_for_interview':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
      case 'interviewed':
        return 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300';
      case 'hired':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
      case 'rejected':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      default:
        return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
      case 'pending':
        return <Clock size={16} />;
      case 'under_review':
      case 'reviewed':
        return <FileText size={16} />;
      case 'shortlisted':
        return <CheckCircle size={16} />;
      case 'scheduled_for_interview':
        return <Calendar size={16} />;
      case 'interviewed':
        return <MessageSquare size={16} />;
      case 'hired':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <X size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const handleWithdrawApplication = async () => {
    if (!application || !user) {
      showError('Unable to withdraw application');
      return;
    }

    setIsWithdrawing(true);
    
    try {
      await withdrawApplication({
        applicationId: application._id,
        socialId: user.id,
      });
      
      showSuccess('Application withdrawn successfully');
      navigate('/my-applications');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      showError('Failed to withdraw application. Please try again.');
    } finally {
      setIsWithdrawing(false);
      setShowWithdrawDialog(false);
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/jobs" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/25 animate-pulse">
                  <CheckCircle size={36} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Star size={12} className="text-yellow-900" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-3 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Application Submitted!
            </h1>
            <p className="text-gray-300 text-xl mb-2">Your application has been successfully submitted</p>
            <div className="flex items-center justify-center gap-2 text-green-400">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">Application ID: {application._id ? String(application._id).slice(-8) : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Application Status */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium">Current Status:</span>
                  <Badge className={`${getStatusColor(application.status || 'submitted')} border px-3 py-1`}>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(application.status || 'submitted')}
                      <span className="font-medium">{application.status || 'Submitted'}</span>
                    </div>
                  </Badge>
                </div>
                <p className="text-green-400 text-sm">✅ Your application is being processed</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Applied Date:</span>
                  <span className="text-white font-medium">
                    {new Date(application.createdAt || Date.now()).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Application ID:</span>
                  <span className="text-white font-mono text-sm bg-gray-800/50 px-2 py-1 rounded">
                    #{application._id ? String(application._id).slice(-8) : 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Response Time:</span>
                  <span className="text-white font-medium">2-3 business days</span>
                </div>
              </div>
              
              {/* Withdraw Button */}
              <div className="pt-4 border-t border-gray-700/50">
                <Button
                  onClick={() => setShowWithdrawDialog(true)}
                  variant="outline"
                  size="sm"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all"
                >
                  <Trash2 size={16} className="mr-2" />
                  Withdraw Application
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interview Details */}
          {(application?.status === 'scheduled_for_interview' || application?.status === 'interviewed') && interviewDetails && (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-300 font-medium">Interview Status:</span>
                    <Badge className={`${
                      application?.status === 'interviewed' 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    } border px-3 py-1`}>
                      <div className="flex items-center gap-2">
                        {application?.status === 'interviewed' ? <CheckCircle size={14} /> : <Calendar size={14} />}
                        <span className="font-medium">
                          {application?.status === 'interviewed' ? 'Completed' : 'Scheduled'}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-300">Date & Time</p>
                        <p className="text-white font-medium">
                          {new Date(interviewDetails.scheduledDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-green-400" />
                      <div>
                        <p className="text-sm text-gray-300">Duration</p>
                        <p className="text-white font-medium">{interviewDetails.duration} minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {interviewDetails.type === 'video' && <Video size={16} className="text-blue-400" />}
                      {interviewDetails.type === 'phone' && <Phone size={16} className="text-green-400" />}
                      {interviewDetails.type === 'in-person' && <MapPin size={16} className="text-red-400" />}
                      {interviewDetails.type === 'panel' && <Users size={16} className="text-purple-400" />}
                      <div>
                        <p className="text-sm text-gray-300">Type</p>
                        <p className="text-white font-medium capitalize">{interviewDetails.type} Interview</p>
                      </div>
                    </div>
                    
                    {interviewDetails.location && (
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-red-400" />
                        <div>
                          <p className="text-sm text-gray-300">Location</p>
                          <p className="text-white font-medium">{interviewDetails.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {interviewDetails.meetingLink && (
                      <div className="flex items-center gap-3">
                        <Video size={16} className="text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-300">Meeting Link</p>
                          <a 
                            href={interviewDetails.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline font-medium"
                          >
                            Join Interview
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {interviewDetails.interviewer && (
                      <div className="flex items-center gap-3">
                        <User size={16} className="text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-300">Interviewer</p>
                          <p className="text-white font-medium">{interviewDetails.interviewer}</p>
                        </div>
                      </div>
                    )}
                    
                    {interviewDetails.notes && (
                      <div className="mt-3 p-3 bg-gray-800/30 rounded-lg">
                        <p className="text-sm text-gray-300 mb-1">Additional Notes:</p>
                        <p className="text-white text-sm">{interviewDetails.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Information */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-blue-400" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">{job.title}</h3>
                <p className="text-gray-300">{job.company?.name || (typeof job.company === 'string' ? job.company : 'Company')}</p>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{job.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={14} />
                  <span>{job.jobType || 'Full-time'}</span>
                </div>
              </div>
              
              <div className="pt-2">
                <Link to={`/job/${job._id}`}>
                  <Button variant="outline" size="sm" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20">
                    <ExternalLink size={14} className="mr-2" />
                    View Job Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Application Details */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5 text-purple-400" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium text-lg">Personal Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User size={16} className="text-gray-400" />
                      <span className="text-gray-300">Name:</span>
                      <span className="text-white">{application.fullName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-300">Email:</span>
                      <span className="text-white">{application.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-300">Phone:</span>
                      <span className="text-white">{application.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="text-gray-300">Location:</span>
                      <span className="text-white">{application.location}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h4 className="text-white font-medium text-lg">Professional Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Briefcase size={16} className="text-gray-400" />
                      <span className="text-gray-300">Experience:</span>
                      <span className="text-white">{application.experienceYears} years</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 size={16} className="text-gray-400" />
                      <span className="text-gray-300">Current Role:</span>
                      <span className="text-white">{application.currentPosition}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award size={16} className="text-gray-400" />
                      <span className="text-gray-300">Skills:</span>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(application.skills) && application.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} className="bg-blue-500/20 border-blue-500/50 text-blue-300 text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {Array.isArray(application.skills) && application.skills.length > 3 && (
                          <Badge className="bg-gray-500/20 border-gray-500/50 text-gray-300 text-xs">
                            +{application.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              {application.coverLetter && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h4 className="text-white font-medium text-lg mb-3">Cover Letter</h4>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                      {application.coverLetter}
                    </p>
                  </div>
                </div>
              )}

              {/* Resume Section */}
              {application.resumeUrl && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h4 className="text-white font-medium text-lg mb-4 flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-green-400" />
                    Resume Document
                  </h4>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <FileText size={20} className="text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{application.resumeFileName || 'Resume.pdf'}</p>
                          <p className="text-gray-400 text-sm">PDF Document</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                          onClick={() => window.open(application.resumeUrl, '_blank')}
                        >
                          <Eye size={14} className="mr-2" />
                          View Resume
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = application.resumeUrl;
                            link.download = application.resumeFileName || 'Resume.pdf';
                            link.click();
                          }}
                        >
                          <Download size={14} className="mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm">
                      <p>📄 This is the resume you submitted with your application. You can view it in a new tab or download it for your records.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Calendar className="h-5 w-5 text-green-400" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg mb-2">Application Review</h4>
                    <p className="text-gray-300 mb-2">Our hiring team will carefully review your application, resume, and cover letter.</p>
                    <div className="flex items-center gap-2 text-blue-400 text-sm">
                      <Clock size={14} />
                      <span>Expected timeline: 2-3 business days</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg mb-2">Initial Screening</h4>
                    <p className="text-gray-300 mb-2">If your profile matches our requirements, you'll receive an email for an initial phone screening.</p>
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <MessageSquare size={14} />
                      <span>Phone or video call (15-30 minutes)</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-lg mb-2">Interview Process</h4>
                    <p className="text-gray-300 mb-2">Successful candidates will be invited for technical and cultural interviews with the team.</p>
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <Users size={14} />
                      <span>Technical + Cultural fit assessment</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-700/50">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Bell size={20} className="text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium mb-1">Stay Updated</h4>
                      <p className="text-gray-300 text-sm">We'll notify you via email about any updates to your application status. Make sure to check your spam folder!</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/my-applications" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                      <FileText size={16} className="mr-2" />
                      View All Applications
                    </Button>
                  </Link>
                  <Link to="/jobs" className="flex-1">
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 hover:border-white/30">
                      <Briefcase size={16} className="mr-2" />
                      Browse More Jobs
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Withdraw Confirmation Dialog */}
      {showWithdrawDialog && (
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
              Are you sure you want to withdraw your application for <strong className="text-white">{job?.title}</strong> at <strong className="text-white">{job?.company?.name || (typeof job?.company === 'string' ? job?.company : 'Company')}</strong>?
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
    </div>
  );
};

export default ApplicationStatusPage;
