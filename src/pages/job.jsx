import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sampleJobs } from "@/data/sampleJobs";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Users, 
  ArrowLeft,
  Star,
  CheckCircle,
  FileText,
  Calendar,
  Globe,
  Award,
  TrendingUp,
  Heart,
  Zap,
  User
} from "lucide-react";
import { useGetJob } from "@/api/apiJobs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ApplicationDrawer from "@/components/application-drawer";
import { useGetUser } from "@/api/apiUsers";
import { useGetFilesByUser } from "@/api/apiFileStorage";
import { useCreateApplication } from "@/api/apiApplications";
import { useToast } from "@/context/ToastContext";
import { useNavigate } from "react-router-dom";

const JobPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [isApplicationDrawerOpen, setIsApplicationDrawerOpen] = useState(false);
  const [isQuickApplying, setIsQuickApplying] = useState(false);
  
  // Convex hooks
  const databaseUser = useGetUser(user?.id);
  const createApplication = useCreateApplication();
  const userFiles = useGetFilesByUser(user?.id);
  
  // Debug logging for data retrieval
  console.log('🔍 Job Page Debug:');
  console.log('🔍 user?.id:', user?.id);
  console.log('🔍 databaseUser:', databaseUser);
  console.log('🔍 databaseUser type:', typeof databaseUser);
  console.log('🔍 databaseUser keys:', databaseUser ? Object.keys(databaseUser) : 'No databaseUser');
  
  // Check if this is a sample job
  const isSampleJob = id && id.startsWith('k1734x8k');
  const sampleJob = isSampleJob ? sampleJobs.find(job => job._id === id) : null;

  // Convex hooks - always call them, but conditionally pass parameters
  const job = useGetJob(isSampleJob ? null : id);

  // Use job data (sample or real)
  const jobData = isSampleJob ? sampleJob : job;

  // Handle case when no job ID is provided
  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Job ID Provided</h1>
          <p className="text-gray-300">Please navigate to a job from the job listing page.</p>
        </div>
      </div>
    );
  }

  // Handle case when sample job is not found
  if (isSampleJob && !sampleJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Sample Job Not Found</h1>
          <p className="text-gray-300">The requested sample job could not be found.</p>
        </div>
      </div>
    );
  }

  // Handle case when job data is not available
  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
          <p className="text-gray-300">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Profile validation function
  const isProfileComplete = () => {
    if (!databaseUser) {
      return false;
    }
    
    // Core required fields for all candidates
    const coreRequiredFields = [
      'firstName',
      'email',
      'phone',
      'location',
      'skills'
    ];
    
    // Check core fields
    const coreFieldsComplete = coreRequiredFields.every(field => {
      const value = databaseUser[field];
      
      if (field === 'skills') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value.toString().trim() !== '';
    });
    
    // For experienced candidates (1+ years), also require position and company
    // Handle case where experienceYears might be 0, null, or undefined
    const experienceYears = databaseUser.experienceYears;
    const isExperienced = experienceYears !== null && experienceYears !== undefined && parseInt(experienceYears) >= 1;
    
    // Special case: if experienceYears is 0, we're dealing with a fresher
    const isFresher = experienceYears === 0;
    
    if (isExperienced) {
      const experienceFields = ['currentPosition', 'currentCompany'];
      const experienceFieldsComplete = experienceFields.every(field => {
        const value = databaseUser[field];
        return value && value.toString().trim() !== '';
      });
      
      return coreFieldsComplete && experienceFieldsComplete;
    }
    
    // For freshers (0 years or no experience), only core fields are required
    return coreFieldsComplete;
  };

  const getMissingFields = () => {
    if (!databaseUser) return ['Profile not found'];
    
    const coreRequiredFields = {
      'firstName': 'First Name',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'location': 'Location',
      'skills': 'Skills'
    };
    
    const missing = [];
    
    // Check core required fields
    Object.entries(coreRequiredFields).forEach(([field, label]) => {
      const value = databaseUser[field];
      if (field === 'skills') {
        if (!Array.isArray(value) || value.length === 0) {
          missing.push(label);
        }
      } else if (!value || value.toString().trim() === '') {
        missing.push(label);
      }
    });
    
    // For experienced candidates, also check experience fields
    const isExperienced = databaseUser.experienceYears && parseInt(databaseUser.experienceYears) >= 1;
    
    if (isExperienced) {
      const experienceFields = {
        'currentPosition': 'Current Position',
        'currentCompany': 'Current Company'
      };
      
      Object.entries(experienceFields).forEach(([field, label]) => {
        const value = databaseUser[field];
        if (!value || value.toString().trim() === '') {
          missing.push(label);
        }
      });
    }
    
    return missing;
  };

  // Quick Apply function
  const handleQuickApply = async () => {
    console.log('🚀 Quick Apply button clicked!');
    console.log('🚀 User:', user);
    console.log('🚀 DatabaseUser:', databaseUser);
    
    if (!user) {
      console.log('❌ No user found');
      showError('Please log in to apply for jobs');
      return;
    }

    if (!databaseUser) {
      console.log('❌ No databaseUser found');
      showError('Please complete your profile first to use Quick Apply');
      return;
    }

    console.log('🔍 Checking if profile is complete...');
    const profileComplete = isProfileComplete();
    console.log('🔍 Profile complete result:', profileComplete);

    if (!profileComplete) {
      const missingFields = getMissingFields();
      console.log('❌ Missing fields:', missingFields);
      const isExperienced = databaseUser.experienceYears && parseInt(databaseUser.experienceYears) >= 1;
      const message = isExperienced 
        ? `🚫 Profile Incomplete! Please fill in: ${missingFields.join(', ')}. Go to your profile to complete these fields.`
        : `🚫 Profile Incomplete! Please fill in: ${missingFields.join(', ')}. Experience fields are optional for freshers.`;
      showError(message);
      return;
    }

    // Check if user has a resume (either URL or uploaded file)
    const hasResume = (databaseUser.resumeUrl && databaseUser.resumeUrl.startsWith('http')) || (userFiles && userFiles.length > 0 && userFiles.some(file => file.fileType.includes('pdf')));
    if (!hasResume) {
      showError('Please upload a resume to your profile to use Quick Apply. Go to your profile page and upload a PDF resume.');
      return;
    }

    console.log('✅ Profile is complete, proceeding with Quick Apply...');

    setIsQuickApplying(true);
    try {
      // Generate cover letter from profile data
      const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobData?.title} position at ${jobData?.company?.name || (typeof jobData?.company === 'string' ? jobData?.company : 'Company')}.

With ${databaseUser.experienceYears || 0} years of experience in ${databaseUser.currentPosition || 'software development'}, I bring a strong foundation in ${(databaseUser.skills || []).slice(0, 3).join(', ')} and a passion for delivering high-quality solutions.

${databaseUser.bio ? `About me: ${databaseUser.bio}` : ''}

${databaseUser.projects?.length > 0 ? `I have worked on several projects including: ${databaseUser.projects.slice(0, 2).join(', ')}.` : ''}

I am ${databaseUser.availability || 'immediately available'} and would welcome the opportunity to discuss how my skills and experience can contribute to your team.

Thank you for considering my application.

Best regards,
${databaseUser.firstName || ''} ${databaseUser.lastName || ''}`;

      // Check if user has a resume URL or uploaded files
      let resumeUrl = databaseUser.resumeUrl;
      let resumeFileName = 'Profile Resume';
      
      if (!resumeUrl || !resumeUrl.startsWith('http')) {
        // Try to use the most recent uploaded resume file
        if (userFiles && userFiles.length > 0) {
          // Find the most recent PDF file
          const pdfFiles = userFiles.filter(file => file.fileType.includes('pdf'));
          if (pdfFiles.length > 0) {
            const mostRecentFile = pdfFiles.sort((a, b) => b.uploadedAt - a.uploadedAt)[0];
            resumeUrl = mostRecentFile.downloadUrl;
            resumeFileName = mostRecentFile.fileName;
            console.log('📄 Using uploaded resume file:', mostRecentFile.fileName);
          } else {
            showError('Please upload a PDF resume to your profile or My Resumes page to use quick apply');
            setIsQuickApplying(false);
            return;
          }
        } else {
          showError('Please upload a resume to your profile or My Resumes page to use quick apply');
          setIsQuickApplying(false);
          return;
        }
      } else {
        console.log('📄 Using existing resume URL:', databaseUser.resumeUrl);
      }
      
      // Create application with only the fields expected by the mutation
      const applicationData = {
        socialId: user.id, // Required field
        jobId: jobData._id, // Required field
        coverLetter: coverLetter, // Optional field
        resumeFileId: resumeUrl, // Pass the resume URL
        resumeFileName: resumeFileName, // Optional field
        resumeFileType: 'application/pdf' // Optional field
      };

      const result = await createApplication(applicationData);
      
      showSuccess('🎉 Application submitted successfully! You will be redirected to view your application status.');
      
      // Create a proper application object for the status page
      const applicationForStatus = {
        _id: result.applicationId,
        status: 'submitted',
        createdAt: Date.now(),
        appliedAt: Date.now(),
        coverLetter: coverLetter,
        resumeUrl: resumeUrl,
        resumeFileName: resumeFileName,
        candidateId: user.id,
        jobId: jobData._id,
        // Include user profile data for display
        fullName: `${databaseUser.firstName || ''} ${databaseUser.lastName || ''}`.trim(),
        email: databaseUser.email || '',
        phone: databaseUser.phone || '',
        location: databaseUser.location || '',
        experienceYears: databaseUser.experienceYears || 0,
        currentPosition: databaseUser.currentPosition || '',
        currentCompany: databaseUser.currentCompany || '',
        skills: databaseUser.skills || [],
        education: databaseUser.education || '',
        availability: databaseUser.availability || '',
        expectedSalary: databaseUser.expectedSalary || '',
        noticePeriod: databaseUser.noticePeriod || ''
      };
      
      // Redirect to application status page
      navigate(`/application-status/${result.applicationId}`, {
        state: {
          application: applicationForStatus,
          job: jobData,
          user: databaseUser
        }
      });
      
    } catch (error) {
      console.error('Quick apply error:', error);
      showError('❌ Failed to submit application. Please try again or use the regular apply form.');
    } finally {
      setIsQuickApplying(false);
    }
  };


  return (
    <>
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

      <div className="relative z-10">
        {/* Header with Back Button */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Link 
                to="/jobs" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Jobs</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            
            {/* Main Content */}
            <div className="space-y-8">
              
              {/* Job Header Card */}
              <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
                      <img 
                        src={(() => {
                          const logoUrl = jobData?.company?.logoUrl;
                          const companyName = jobData?.company?.name || jobData?.company || '';
                          // Try different file extensions for fallback
                          const baseName = companyName.toLowerCase().replace(/\s+/g, '');
                          // Map specific companies to their correct file extensions
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
                          };
                          const fallbackPath = logoMap[baseName] || `/companies/${baseName}.svg`;
                          
                          if (logoUrl) {
                            return logoUrl;
                          } else {
                            return fallbackPath;
                          }
                        })()} 
                        alt={`${jobData?.company?.name || jobData?.company} logo`}
                        className="w-32 h-32 object-contain"
                onError={(e) => {
                  e.target.src = '/companies/default.svg';
                }}
              />
                      <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{jobData.title}</h1>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Building2 size={16} />
                          <span className="font-medium">{jobData.company?.name || jobData.company}</span>
            </div>
          </div>
          </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                      <CheckCircle size={14} className="mr-1" />
                      Open
                    </Badge>
        </div>

                  {/* Job Meta Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin size={16} className="text-blue-400" />
                      <span className="text-sm">{jobData.location}</span>
        </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Briefcase size={16} className="text-purple-400" />
                      <span className="text-sm capitalize">{jobData.jobType}</span>
        </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Award size={16} className="text-orange-400" />
                      <span className="text-sm capitalize">{jobData.experienceLevel || 'Any'}</span>
                </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users size={16} className="text-green-400" />
                      <span className="text-sm">12 applicants</span>
                </div>
          </div>
                </CardContent>
              </Card>

              {/* About the Job */}
              <Card className="bg-gray-800/30 backdrop-blur-sm border-white/10">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText size={24} className="text-blue-400" />
                    About the Role
                  </h2>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {jobData.company?.name || jobData.company} is seeking an experienced {jobData.title} to join our innovative team. 
                    You will be responsible for analyzing large datasets to uncover insights and drive data-driven decision making 
                    that shapes our product strategy and business growth.
                  </p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="bg-gray-800/30 backdrop-blur-sm border-white/10">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <TrendingUp size={24} className="text-green-400" />
                    What We're Looking For
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Analyze large datasets to identify trends and patterns",
                      "Develop and implement predictive models and algorithms", 
                      "Collaborate with cross-functional teams to deliver insights",
                      "Communicate findings to stakeholders with actionable recommendations",
                      "Stay updated with latest data science and ML advancements",
                      "Build scalable data pipelines and automation tools"
                    ].map((requirement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle size={16} className="text-green-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{requirement}</span>
                      </div>
                    ))}
            </div>
                </CardContent>
              </Card>

              {/* Skills & Requirements */}
              <Card className="bg-gray-800/30 backdrop-blur-sm border-white/10">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Star size={24} className="text-yellow-400" />
                    Required Skills
                  </h2>
                  <div className="flex flex-wrap gap-3 break-words">
                    {jobData.skillsRequired?.map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                        {skill}
                      </Badge>
                    )) || ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization'].map((skill, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Job Details Card - Now Full Width */}
            <Card className="bg-gray-800/30 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Globe size={24} className="text-blue-400" />
                  Job Details
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center text-center p-4 bg-gray-700/30 rounded-xl">
                    <Building2 size={24} className="text-blue-400 mb-2" />
                    <span className="text-gray-400 text-sm mb-1">Company</span>
                    <span className="text-white font-medium">{jobData.company?.name || jobData.company}</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-700/30 rounded-xl">
                    <MapPin size={24} className="text-green-400 mb-2" />
                    <span className="text-gray-400 text-sm mb-1">Location</span>
                    <span className="text-white font-medium">{jobData.location}</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-700/30 rounded-xl">
                    <Briefcase size={24} className="text-purple-400 mb-2" />
                    <span className="text-gray-400 text-sm mb-1">Type</span>
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-300 border-purple-500/30">
                      {jobData.jobType}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center text-center p-4 bg-gray-700/30 rounded-xl">
                    <Award size={24} className="text-orange-400 mb-2" />
                    <span className="text-gray-400 text-sm mb-1">Experience</span>
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-300 border-orange-500/30">
                      {jobData.experienceLevel || 'Any'}
                    </Badge>
              </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={16} />
                      <span className="text-sm">Posted 2 days ago</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users size={16} />
                      <span className="text-sm">12 applicants</span>
                </div>
              </div>
          </div>
              </CardContent>
            </Card>

            {/* Apply Section - Only for candidates */}
            {databaseUser?.role === 'candidate' && (
            <Card className="bg-gradient-to-r from-green-600/20 to-green-700/20 backdrop-blur-sm border-green-500/30">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <Briefcase size={24} className="text-green-400" />
                  Ready to Apply?
                </h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Join {Math.floor(Math.random() * 50) + 5} other candidates who have already applied for this position.
                </p>
                <div className="flex flex-col gap-4 justify-center">
                  
                  {/* Quick Fix Button for Missing Fields */}
                  {databaseUser && !isProfileComplete() && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <h4 className="text-yellow-300 font-medium mb-2">🔧 Quick Fix Missing Fields</h4>
                      <p className="text-yellow-200 text-sm mb-3">
                        Your profile is missing some required fields. Click below to quickly set them:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(!databaseUser.skills || databaseUser.skills.length === 0) && (
                          <Button
                            onClick={() => {
                              const skill = prompt('Enter a skill to add to your profile (e.g., JavaScript, Communication, Problem Solving):');
                              if (skill && skill.trim()) {
                                console.log('Adding skill:', skill.trim());
                                // For now, just show a message - in a real implementation, this would update the profile
                                alert(`Skill "${skill.trim()}" would be added to your profile. Please go to your profile page to add skills.`);
                              }
                            }}
                            size="sm"
                            className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30"
                          >
                            Add Skills
                          </Button>
                        )}
                        {(databaseUser.experienceYears === null || databaseUser.experienceYears === undefined) && (
                          <Button
                            onClick={() => {
                              console.log('Setting experience years to 0...');
                            }}
                            size="sm"
                            className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30"
                          >
                            Set Experience (0 years)
                          </Button>
                        )}
                        <Button
                          onClick={() => window.open('/profile', '_blank')}
                          size="sm"
                          className="bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
                        >
                          Go to Profile Page
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Apply Button */}
                  <div className="relative group">
                    <Button 
                      onClick={() => {
                        console.log('🔘 Quick Apply button clicked');
                        console.log('🔘 isQuickApplying:', isQuickApplying);
                        console.log('🔘 databaseUser:', databaseUser);
                        console.log('🔘 isProfileComplete():', isProfileComplete());
                        handleQuickApply();
                      }}
                      disabled={isQuickApplying || !databaseUser || !isProfileComplete()}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-8 py-4 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                    >
                      {isQuickApplying ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Applying...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Zap size={20} />
                          Quick Apply
                        </div>
                      )}
                    </Button>
                    
                    {/* Tooltip for incomplete profile */}
                    {(!databaseUser || !isProfileComplete()) && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 max-w-xs">
                        <div className="text-center">
                          <p className="mb-2">
                            {!databaseUser 
                              ? 'Complete your profile first' 
                              : databaseUser.experienceYears && parseInt(databaseUser.experienceYears) >= 1
                                ? 'Complete your profile to use Quick Apply'
                                : 'Complete your basic profile to use Quick Apply (experience fields optional for freshers)'
                            }
                          </p>
                          <Link to="/profile" className="text-blue-400 hover:text-blue-300 underline">
                            Go to Profile →
                          </Link>
                        </div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
          </div>
            
                  {/* Regular Apply and Save Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={() => setIsApplicationDrawerOpen(true)}
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-8 py-3 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} />
                        Apply Now
                      </div>
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-green-500/50 hover:bg-green-500/20 text-green-300 font-medium px-8 py-3 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        <Heart size={18} />
                        Save Job
                      </div>
                    </Button>
            </div>
          </div>
                <p className="text-gray-400 text-sm mt-4">
                  Application takes less than 5 minutes
                </p>
              </CardContent>
            </Card>
            )}

            {/* Job Management Section - Only for recruiters */}
            {databaseUser?.role === 'recruiter' && (
            <Card className="bg-gradient-to-r from-blue-600/20 to-purple-700/20 backdrop-blur-sm border-blue-500/30">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <Building2 size={24} className="text-blue-400" />
                  Manage Your Job
                </h2>
                <p className="text-gray-300 mb-6 text-lg">
                  You posted this job. Manage applications and view candidate details.
                </p>
                <div className="flex flex-col gap-4 justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <Users size={24} className="text-blue-400 mx-auto mb-2" />
                      <h3 className="text-white font-semibold mb-1">View Applicants</h3>
                      <p className="text-gray-300 text-sm mb-3">See all candidates who applied</p>
                      <Link to={`/job/${jobData._id}/applicants`}>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <Users size={16} className="mr-2" />
                          View Applicants
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <FileText size={24} className="text-green-400 mx-auto mb-2" />
                      <h3 className="text-white font-semibold mb-1">Edit Job</h3>
                      <p className="text-gray-300 text-sm mb-3">Update job details and requirements</p>
                      {(jobData.recruiterId === user?.id || jobData.recruiter_id === user?.id) ? (
                        <Link to={`/edit-job/${jobData._id}`}>
                          <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">
                            <FileText size={16} className="mr-2" />
                            Edit Job
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full border-gray-500/20 text-gray-400 cursor-not-allowed" 
                          disabled
                        >
                          <FileText size={16} className="mr-2" />
                          Not Your Job
                        </Button>
                      )}
                    </div>
                    
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <TrendingUp size={24} className="text-purple-400 mx-auto mb-2" />
                      <h3 className="text-white font-semibold mb-1">Job Analytics</h3>
                      <p className="text-gray-300 text-sm mb-3">View job performance metrics</p>
                      <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">
                        <TrendingUp size={16} className="mr-2" />
                        View Analytics
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h4 className="text-blue-300 font-medium mb-2">📊 Job Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{Math.floor(Math.random() * 50) + 5}</div>
                        <div className="text-gray-300">Total Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{Math.floor(Math.random() * 10) + 1}</div>
                        <div className="text-gray-300">Shortlisted</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Role Selection Section - For users without a role */}
            {(!databaseUser || !databaseUser.role) && (
            <Card className="bg-gradient-to-r from-yellow-600/20 to-orange-700/20 backdrop-blur-sm border-yellow-500/30">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                  <User size={24} className="text-yellow-400" />
                  Choose Your Role
                </h2>
                <p className="text-gray-300 mb-6 text-lg">
                  Please complete your profile and choose whether you're a candidate or recruiter to access job features.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/profile">
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3">
                      <User size={18} className="mr-2" />
                      Complete Profile
                    </Button>
                  </Link>
                  <Link to="/onboarding">
                    <Button variant="outline" className="border-yellow-500/50 hover:bg-yellow-500/20 text-yellow-300 px-8 py-3">
                      <Award size={18} className="mr-2" />
                      Set Up Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            )}
        </div>
      </div>
      </div>
    </main>

    {/* Application Drawer - Only for candidates */}
    {databaseUser?.role === 'candidate' && (
      <ApplicationDrawer 
        isOpen={isApplicationDrawerOpen}
        onClose={() => setIsApplicationDrawerOpen(false)}
        job={jobData}
      />
    )}
    </>
  );
};

export default JobPage;