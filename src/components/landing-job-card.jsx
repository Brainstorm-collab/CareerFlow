import { MapPin, Briefcase, Clock, Bookmark, BookmarkCheck, Heart, Building2, DollarSign, Zap, Users, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIsJobSaved, useToggleSaveJob } from "@/api/apiSavedJobs";
import { useToast } from "../context/ToastContext";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import ApplicationDrawer from "./application-drawer";
import { useGetApplicationsByJob, useCreateApplication } from "@/api/apiApplication";
import { useDeleteJob } from "@/api/apiJobs";
import { useGetUser } from "@/api/apiUsers";
import { useGenerateUploadUrl, useUpdateFileUrl, useGetFilesByUser } from "@/api/apiFileStorage";
import OptimizedCompanyLogo from "./ui/optimized-company-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LandingJobCard = memo(({ job, isRecruiter = false, onJobDeleted }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplicationDrawerOpen, setIsApplicationDrawerOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isQuickApplying, setIsQuickApplying] = useState(false);
  
  // Debug logging (commented out for production)
  // console.log('LandingJobCard - isRecruiter:', isRecruiter, 'job.recruiterId:', job.recruiterId, 'user.id:', user?.id);
  
  // Delete job mutation
  const deleteJob = useDeleteJob();
  
  // Quick apply hooks
  const createApplication = useCreateApplication();
  const databaseUser = useGetUser(user?.id);
  const generateUploadUrl = useGenerateUploadUrl();
  const updateFileUrl = useUpdateFileUrl();
  const userFiles = useGetFilesByUser(user?.id);
  
  // Check if this is a sample job (doesn't exist in database)
  const isSampleJob = job._id && job._id.startsWith('k1734x8k');
  
  // OPTIMIZATION: Only fetch saved status and applications for real jobs
  const isJobSavedQuery = useIsJobSaved(user?.id, isSampleJob ? null : job?._id);
  const toggleSaveJob = useToggleSaveJob();
  
  // Get real-time applicant count from Convex (only for real jobs)
  const applications = useGetApplicationsByJob(isSampleJob ? null : job?._id);
  const applicantsCount = applications?.length || 0;

  // Check if job is saved when component mounts (only for real jobs)
  useEffect(() => {
    if (!isSampleJob && isJobSavedQuery !== undefined) {
      setIsSaved(isJobSavedQuery);
    }
  }, [isJobSavedQuery, isSampleJob]);

  // OPTIMIZATION: Memoized company logo path to prevent unnecessary recalculations
  const companyLogoPath = useMemo(() => {
    // First, try to use the actual company logo from database
    if (job.company?.logoUrl) {
      return job.company.logoUrl;
    }
    
    const company = job.company?.name || (typeof job.company === 'string' ? job.company : '');
    
    // Handle different company data structures
    let companyName = '';
    
    if (typeof company === 'string') {
      companyName = company;
    } else if (company && typeof company === 'object') {
      companyName = company.name || company.company_name || '';
    }
    
    // If no company name, return default
    if (!companyName) {
      return '/companies/default.svg';
    }
    
    // Normalize company name for matching
    const normalizedName = companyName.toLowerCase().trim();
    
    // Map company names to their logo files (fallback for companies without logoUrl)
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
      'facebook': '/companies/meta.svg',
      'alphabet': '/companies/google.webp',
      'techcorp inc': '/companies/microsoft.webp',
      'techcorp': '/companies/microsoft.webp',
      'test company': '/companies/google.webp', // Map Test Company to Google logo
      'tesla': '/companies/apple.svg',
      'nvidia': '/companies/ibm.svg',
      'salesforce': '/companies/amazon.svg',
      'adobe': '/companies/netflix.png',
      'oracle': '/companies/uber.svg',
      'intel': '/companies/atlassian.svg',
      'cisco': '/companies/google.webp',
    };
    
    const logoPath = logoMap[normalizedName] || '/companies/default.svg';
    return logoPath;
  }, [job.company]);

  // Simple image error handler
  const handleImageError = useCallback((e) => {
    e.target.src = '/companies/default.svg';
  }, []);

  // Image load handler
  const handleImageLoad = useCallback((e) => {
    // Image loaded successfully
  }, []);

  // OPTIMIZATION: Memoized save job handler
  const handleSaveJob = useCallback(async () => {
    if (!user || !job?._id) return;
    
    // Handle sample jobs
    if (isSampleJob) {
      setIsSaved(!isSaved);
      if (!isSaved) {
        showSuccess('Sample job saved! (This is a demo - real jobs will be saved to your Saved Jobs page)');
      } else {
        showSuccess('Sample job removed from saved jobs.');
      }
      return;
    }
    
    try {
      console.log('Save button clicked for job:', job._id, 'Current saved state:', isSaved);
      
      const result = await toggleSaveJob({
        socialId: user.id,
        jobId: job._id
      });
      
      if (result?.action === 'saved') {
        setIsSaved(true);
        showSuccess('Job saved successfully! You can find it in your Saved Jobs page.');
        console.log('Job saved successfully');
      } else if (result?.action === 'unsaved') {
        setIsSaved(false);
        showSuccess('Job removed from saved jobs.');
        console.log('Job unsaved successfully');
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      showError('Failed to save job. Please try again.');
    }
  }, [user, job._id, isSampleJob, isSaved, toggleSaveJob, showSuccess, showError]);

  // Dropdown menu functions for recruiters
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

  const handleEditJob = () => {
    if (isSampleJob) {
      showError('Cannot edit sample jobs');
      return;
    }
    
    // Check if current user is the owner of the job
    if (job.recruiterId !== user?.id && job.recruiter_id !== user?.id) {
      showError('You can only edit jobs you created');
      return;
    }
    
    const jobId = job._id || job.id;
    if (!jobId) {
      showError('Job ID not found');
      return;
    }
    
    navigate(`/edit-job/${jobId}`);
  };

  const handleViewJob = () => {
    const jobId = job._id || job.id;
    if (!jobId) {
      showError('Job ID not found');
      return;
    }
    navigate(`/job/${jobId}`);
  };

  const handleManageApplicants = () => {
    const jobId = job._id || job.id;
    if (!jobId) {
      showError('Job ID not found');
      return;
    }
    navigate(`/job/${jobId}/applicants`);
  };

  const handleQuickApply = async () => {
    console.log('🚀 Quick Apply started for job:', job.title);
    
    if (!user || !user.id) {
      showError('Please log in to apply for jobs');
      return;
    }

    if (!databaseUser) {
      showError('Please complete your profile first to use quick apply');
      return;
    }

    // Check if profile has required data including resume
    const hasRequiredData = databaseUser.firstName && databaseUser.email && databaseUser.phone && databaseUser.location && databaseUser.skills && databaseUser.skills.length > 0;
    if (!hasRequiredData) {
      showError('Please complete your profile with required information (name, email, phone, location, skills) to use quick apply');
      return;
    }

    // Check if user has a resume (either URL or uploaded file)
    const hasResume = (databaseUser.resumeUrl && databaseUser.resumeUrl.startsWith('http')) || (userFiles && userFiles.length > 0 && userFiles.some(file => file.fileType.includes('pdf')));
    if (!hasResume) {
      showError('Please upload a resume to your profile to use Quick Apply. Go to your profile page and upload a PDF resume.');
      return;
    }

    setIsQuickApplying(true);

    try {
      // Check if user has a resume URL or uploaded files
      let resumeUrl = databaseUser.resumeUrl;
      let resumeFileName = 'Resume.pdf';
      
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

      // Generate cover letter from profile data
      const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company?.name || (typeof job.company === 'string' ? job.company : 'Company')}.

With ${databaseUser.experienceYears || 0} years of experience in ${databaseUser.currentPosition || 'software development'}, I bring a strong foundation in ${(databaseUser.skills || []).slice(0, 3).join(', ')} and a passion for delivering high-quality solutions.

${databaseUser.bio ? `About me: ${databaseUser.bio}` : ''}

${databaseUser.projects?.length > 0 ? `I have worked on several projects including: ${databaseUser.projects.slice(0, 2).join(', ')}.` : ''}

I am ${databaseUser.availability || 'immediately available'} and would welcome the opportunity to discuss how my skills and experience can contribute to your team.

Thank you for considering my application.

Best regards,
${databaseUser.firstName || ''} ${databaseUser.lastName || ''}`;

      console.log('📝 Submitting quick application...');
      
      // Submit application
      const result = await createApplication({
        socialId: user.id,
        jobId: job._id,
        coverLetter: coverLetter,
        resumeFileId: resumeUrl, // Pass the resume URL as a string
        resumeFileName: resumeFileName,
        resumeFileSize: 0,
        resumeFileType: 'application/pdf',
      });

      console.log('✅ Quick application submitted successfully:', result);
      
      // Create application object for navigation
      const applicationData = {
        _id: result,
        fullName: `${databaseUser.firstName || ''} ${databaseUser.lastName || ''}`.trim(),
        email: databaseUser.email || '',
        phone: databaseUser.phone || '',
        location: databaseUser.location || '',
        experienceYears: databaseUser.experienceYears || 0,
        currentPosition: databaseUser.currentPosition || '',
        currentCompany: databaseUser.currentCompany || '',
        skills: databaseUser.skills || [],
        coverLetter: coverLetter,
        resumeUrl: resumeUrl,
        resumeFileName: resumeFileName,
        status: 'submitted',
        createdAt: Date.now(),
      };

      showSuccess(`Successfully applied to ${job.company?.name || (typeof job.company === 'string' ? job.company : 'Company')} as ${job.title}!`);
      
      // Navigate to application status page
      navigate(`/application-status/${result.applicationId}`, {
        state: {
          application: applicationData,
          job: job,
          user: databaseUser
        }
      });

    } catch (error) {
      console.error('❌ Quick application failed:', error);
      const errorMessage = error.message || 'Failed to submit application. Please try again.';
      showError(`Quick apply failed: ${errorMessage}`);
    } finally {
      setIsQuickApplying(false);
    }
  };

  return (
    <>
    <Card className="relative bg-[#1A1E24] border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 rounded-lg min-h-[380px]">
      <CardContent className="p-6">
        {/* Top Right Section - My Job indicator and Dropdown */}
        {isRecruiter && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
            {/* My Job Indicator - positioned before dropdown */}
            {(job.recruiterId === user?.id || job.recruiter_id === user?.id) && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 border border-blue-400/50 text-white text-xs backdrop-blur-sm font-semibold px-2 py-1 rounded-md shadow-lg">
                <Building2 size={12} className="inline mr-1" />
                My Job
              </div>
            )}
            
            {/* 3-Dots Dropdown Menu - Always show for recruiters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-black/30 hover:bg-black/50 text-white/80 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20"
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-gray-800 border-gray-700">
                <DropdownMenuItem 
                  onClick={handleViewJob}
                  className="text-white hover:bg-gray-700 cursor-pointer"
                >
                  <Eye size={16} className="mr-2" />
                  View Job
                </DropdownMenuItem>
                
                {/* Show different options based on job ownership */}
                {(job.recruiterId === user?.id || job.recruiter_id === user?.id) ? (
                  // Job created by current recruiter - show full management options
                  <>
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
                  </>
                ) : (
                  // Job created by other recruiter - show limited options
                  <>
                    <DropdownMenuItem 
                      onClick={handleManageApplicants}
                      className="text-white hover:bg-gray-700 cursor-pointer"
                    >
                      <Users size={16} className="mr-2" />
                      View Applicants ({applicantsCount})
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-600" />
                    <DropdownMenuItem 
                      className="text-gray-400 cursor-not-allowed"
                      disabled={true}
                    >
                      <Edit size={16} className="mr-2" />
                      Edit Job (Not Owner)
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-gray-400 cursor-not-allowed"
                      disabled={true}
                    >
                      <Trash2 size={16} className="mr-2" />
                      Delete Job (Not Owner)
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}



        {/* Top Section - Job Title, Company, Location */}
        <div className="mb-4">
          {/* Job Title */}
          <div className="mb-3">
            <h3 className="text-xl font-bold text-white leading-tight">
              {job.title}
            </h3>
          </div>

          {/* Company Logo and Location */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <OptimizedCompanyLogo 
                key={`${job._id}-logo`}
                company={job.company}
                className="w-12 h-12 object-contain"
              />
            </div>
              
              <div className="flex items-center gap-1 text-sm text-white">
                <MapPin className="w-4 h-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

        {/* Horizontal Separator */}
        <div className="border-t border-gray-600/30 mb-4"></div>

        {/* Middle Section - Job Description */}
        <div className="mb-4">
          <p className="text-white text-sm leading-relaxed">
            {job.company?.name || (typeof job.company === 'string' ? job.company : 'Company')} is seeking an experienced {job.title} to join our analytics team.
          </p>
        </div>

        {/* Application Status - Real-time count */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users size={14} />
            <span>{applicantsCount} {applicantsCount === 1 ? 'applicant' : 'applicants'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Active</span>
          </div>
        </div>



        {/* Bottom Section - Action Buttons */}
        <div className="flex items-center gap-3">
          {/* More Details Button */}
          <div className="flex-1">
            <Link to={`/job/${job._id}`} className="block">
              <Button 
                variant="ghost"
                className="w-full bg-[#1A1E24] border border-gray-600/30 hover:border-gray-500/50 text-white font-normal py-2 transition-all duration-300 text-sm rounded-md"
              >
                More Details
              </Button>
            </Link>
          </div>

          {/* Save Button - Available for all users */}
          <Button 
            onClick={handleSaveJob}
            variant="ghost"
            size="sm"
            className={`px-4 py-2 transition-all duration-300 text-sm rounded-md ${
              isSaved 
                ? 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30'
                : 'bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30'
            }`}
          >
            {isSaved ? (
              <div className="flex items-center gap-2">
                <Heart size={16} className="fill-current" />
                Saved
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Heart size={16} />
                Save
              </div>
            )}
          </Button>
        </div>

        {/* Apply Button - Only for candidates */}
        {!isRecruiter && (
          <div className="mt-3">
            <Button 
              onClick={handleQuickApply}
              disabled={isQuickApplying}
              variant="default"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5 transition-all duration-300 text-sm shadow-lg hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center gap-2">
                {isQuickApplying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Applying...
                  </>
                ) : (
                  <>
                    <Briefcase size={16} />
                    Apply Now
                  </>
                )}
              </div>
            </Button>
          </div>
        )}



        {/* View Applicants Button - Only for recruiters who posted this job */}
        {isRecruiter && (job.recruiterId === user?.id || job.recruiter_id === user?.id) && (
          <div className="text-center mt-3">
            <Link to={`/job/${job._id}/applicants`}>
              <Button 
                variant="default"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-2.5 transition-all duration-300 text-sm shadow-lg hover:shadow-purple-500/25"
              >
                <div className="flex items-center gap-2">
                  <Users size={16} />
                  View Applicants
                </div>
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Application Drawer */}
    <ApplicationDrawer 
      isOpen={isApplicationDrawerOpen}
      onClose={() => setIsApplicationDrawerOpen(false)}
      job={job}
    />
    </>
  );
}, (prevProps, nextProps) => {
  // OPTIMIZATION: Enhanced comparison for better performance
  return (
    prevProps.job._id === nextProps.job._id &&
    prevProps.isRecruiter === nextProps.isRecruiter &&
    prevProps.job.company?.name === nextProps.job.company?.name &&
    prevProps.job.title === nextProps.job.title &&
    prevProps.job.location === nextProps.job.location &&
    prevProps.job.jobType === nextProps.job.jobType &&
    prevProps.job.experienceLevel === nextProps.job.experienceLevel
  );
});

export default LandingJobCard;
