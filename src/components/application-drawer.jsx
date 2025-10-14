import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useCreateApplication } from "@/api/apiApplications";
import { useGenerateUploadUrl, useUpdateFileUrl } from "@/api/apiFileStorage";
import { useGetUser } from "@/api/apiUsers";
import { 
  X, 
  Upload, 
  FileText, 
  User, 
  Briefcase, 
  Award, 
  MapPin, 
  Calendar,
  Building2,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Users,
  Globe,
  TrendingUp,
  Zap,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const ApplicationDrawer = ({ isOpen, onClose, job }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const databaseUser = useGetUser(user?.id);
  
  // Memoize the component to prevent unnecessary re-renders
  const shouldRender = useMemo(() => isOpen, [isOpen]);
  
  // console.log('🚪 ApplicationDrawer rendered - isOpen:', isOpen, 'job:', job);
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    location: '',
    
    // Experience
    experienceYears: '',
    currentPosition: '',
    currentCompany: '',
    
    // Skills
    skills: [],
    newSkill: '',
    
    // Resume
    resumeFile: null,
    coverLetter: '',
    
    // Education
    education: 'postgraduate',
    
    // Additional Information
    availability: '',
    expectedSalary: '',
    noticePeriod: '',
  });

  // Convex hooks
  const createApplication = useCreateApplication();
  const generateUploadUrl = useGenerateUploadUrl();
  const updateFileUrl = useUpdateFileUrl();

  const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Experience", icon: Briefcase },
    { id: 3, title: "Skills", icon: Award },
    { id: 4, title: "Resume & Cover Letter", icon: FileText },
    { id: 5, title: "Review & Submit", icon: CheckCircle },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    if (formData.newSkill.trim() && !formData.skills.includes(formData.newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const autoFillFromProfile = async () => {
    if (!user || !user.id) {
      showError('Please log in to use auto-fill');
      return;
    }

    if (!databaseUser) {
      showError('Please complete your profile first to use auto-fill');
      return;
    }

    // Check if profile has required data
    const hasRequiredData = databaseUser.firstName && databaseUser.email && databaseUser.phone && databaseUser.location;
    if (!hasRequiredData) {
      showError('Please complete your profile with required information (name, email, phone, location) to use auto-fill');
      return;
    }

    setIsAutoFilling(true);
    
    // Simulate a brief loading to show the auto-fill is working with live data
    await new Promise(resolve => setTimeout(resolve, 500));

    setFormData(prev => ({
      ...prev,
      // Personal Information
      fullName: `${databaseUser.firstName || ''} ${databaseUser.lastName || ''}`.trim(),
      email: databaseUser.email || '',
      phone: databaseUser.phone || '',
      location: databaseUser.location || '',
      
      // Experience
      experienceYears: databaseUser.experienceYears?.toString() || '0',
      currentPosition: databaseUser.currentPosition || '',
      currentCompany: databaseUser.currentCompany || '',
      
      // Skills
      skills: Array.isArray(databaseUser.skills) ? databaseUser.skills : [],
      
      // Education
      education: databaseUser.education || 'postgraduate',
      
      // Additional Information
      availability: databaseUser.availability || '',
      expectedSalary: databaseUser.expectedSalary || '',
      noticePeriod: databaseUser.noticePeriod || '',
      
      // Cover Letter (generate from profile data)
      coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the ${job?.title} position at ${job?.company?.name || (typeof job?.company === 'string' ? job?.company : 'Company')}.

With ${databaseUser.experienceYears || 0} years of experience in ${databaseUser.currentPosition || 'software development'}, I bring a strong foundation in ${(databaseUser.skills || []).slice(0, 3).join(', ')} and a passion for delivering high-quality solutions.

${databaseUser.bio ? `About me: ${databaseUser.bio}` : ''}

${databaseUser.projects?.length > 0 ? `I have worked on several projects including: ${databaseUser.projects.slice(0, 2).join(', ')}.` : ''}

I am ${databaseUser.availability || 'immediately available'} and would welcome the opportunity to discuss how my skills and experience can contribute to your team.

Thank you for considering my application.

Best regards,
${databaseUser.firstName || ''} ${databaseUser.lastName || ''}`
    }));

    setIsAutoFilling(false);
    showSuccess('Form auto-filled from your profile! ✨');
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        showError('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
      }

      try {
        // Generate upload URL
        const { uploadUrl, fileId } = await generateUploadUrl({
          socialId: user.id,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });

        // Upload file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error('Failed to upload file');
        }

        const { storageId } = await result.json();

        // Update file URL in database
        await updateFileUrl({
          fileId: fileId,
          storageId: storageId,
        });

        // Store file info in form data
        setFormData(prev => ({
          ...prev,
          resumeFile: {
            ...file,
            fileId: fileId,
            storageId: storageId,
          }
        }));

        showSuccess('Resume uploaded successfully!');
      } catch (error) {
        console.error('Error uploading resume:', error);
        showError('Failed to upload resume. Please try again.');
      }
    }
  };

  const validateForm = () => {
    const errors = [];
    
    // Required personal information
    if (!formData.fullName?.trim()) {
      errors.push('Full name is required');
    }
    if (!formData.email?.trim()) {
      errors.push('Email address is required');
    }
    if (!formData.phone?.trim()) {
      errors.push('Phone number is required');
    }
    if (!formData.location?.trim()) {
      errors.push('Location is required');
    }
    
    // Required professional information
    if (!formData.experienceYears) {
      errors.push('Years of experience is required');
    }
    if (!formData.skills || formData.skills.length === 0) {
      errors.push('At least one skill is required');
    }
    
    // Required documents
    if (!formData.resumeFile) {
      errors.push('Resume upload is required');
    }
    
    return errors;
  };

  const handleSubmit = async () => {
    console.log('=== APPLICATION SUBMISSION DEBUG ===');
    console.log('Form data:', formData);
    console.log('User:', user);
    console.log('Job:', job);
    console.log('Database user:', databaseUser);
    
    // Validate form data
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      console.log('❌ Form validation failed:', validationErrors);
      showError(`Please complete all required fields: ${validationErrors.join(', ')}`);
      return;
    }

    if (!user || !user.id) {
      console.log('❌ User not authenticated');
      showError('Please log in to apply for jobs');
      return;
    }

    if (!job || !job._id) {
      console.log('❌ Job information missing');
      showError('Job information is missing');
      return;
    }

    console.log('✅ All validations passed, submitting application...');
    setIsSubmitting(true);
    
    try {
      const result = await createApplication({
        socialId: user.id,
        jobId: job._id,
        coverLetter: formData.coverLetter,
        resumeFileId: formData.resumeFile.fileId,
        resumeFileName: formData.resumeFile.name,
        resumeFileSize: formData.resumeFile.size,
        resumeFileType: formData.resumeFile.type,
        // Personal Information
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        // Professional Information
        experienceYears: formData.experienceYears,
        currentPosition: formData.currentPosition,
        currentCompany: formData.currentCompany,
        skills: formData.skills,
        education: formData.education,
        // Additional Information
        availability: formData.availability,
        expectedSalary: formData.expectedSalary,
        noticePeriod: formData.noticePeriod,
      });
      
      console.log('✅ Application submitted successfully:', result);
      showSuccess(`Successfully applied to ${job.company?.name || (typeof job.company === 'string' ? job.company : 'Company')} as ${job.title}!`);
      
      // Create application object for navigation
      const applicationData = {
        _id: result,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        experienceYears: formData.experienceYears,
        currentPosition: formData.currentPosition,
        currentCompany: formData.currentCompany,
        skills: formData.skills,
        coverLetter: formData.coverLetter,
        resumeUrl: formData.resumeFile?.fileId ? `https://wary-duck-375.convex.cloud/api/storage/${formData.resumeFile.fileId}` : null,
        resumeFileName: formData.resumeFile?.name,
        status: 'submitted',
        createdAt: Date.now(),
      };

      console.log('📄 Application data created:', applicationData);

      // Reset form and close drawer
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        experienceYears: '',
        currentPosition: '',
        currentCompany: '',
        skills: [],
        newSkill: '',
        resumeFile: null,
        coverLetter: '',
        availability: '',
        expectedSalary: '',
        noticePeriod: '',
      });
      setCurrentStep(1);
      onClose();
      
      console.log('🧭 Navigating to my applications page...');
      // Navigate to my applications page
      navigate('/my-applications');
      
    } catch (error) {
      console.error('❌ Application submission failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Show more specific error message
      const errorMessage = error.message || 'Failed to submit application. Please try again.';
      showError(`Application failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Personal Information
        if (!formData.fullName?.trim() || !formData.email?.trim() || !formData.phone?.trim() || !formData.location?.trim()) {
          showError('Please fill in all personal information fields');
          return false;
        }
        return true;
      case 2: // Experience
        if (!formData.experienceYears) {
          showError('Please select your years of experience');
          return false;
        }
        return true;
      case 3: // Skills
        if (!formData.skills || formData.skills.length === 0) {
          showError('Please add at least one skill');
          return false;
        }
        return true;
      case 4: // Resume & Cover Letter
        if (!formData.resumeFile) {
          showError('Please upload your resume');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!shouldRender) {
    // console.log('🚪 ApplicationDrawer not open, returning null');
    return null;
  }
  
  // console.log('🚪 ApplicationDrawer is open, rendering drawer');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border-l border-gray-700/50 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="relative p-6 border-b border-gray-700/50 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Apply for Position</h2>
                    <p className="text-gray-300 text-sm">Complete your application</p>
                  </div>
                </div>
                
                {/* Job Info Card */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 size={16} className="text-blue-400" />
                    <span className="text-white font-medium text-sm">
                      {job?.company?.name || (typeof job?.company === 'string' ? job?.company : 'Company')}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-1">{job?.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-300">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{job?.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{job?.jobType || 'Full-time'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign size={12} />
                      <span>{job?.salary || 'Competitive'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 py-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Step {currentStep} of {steps.length}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
                <Button
                  onClick={autoFillFromProfile}
                  variant="outline"
                  size="sm"
                  disabled={isAutoFilling || !databaseUser}
                  className="border-green-500/50 text-green-400 hover:bg-green-500/20 hover:border-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAutoFilling ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400 mr-1"></div>
                      Filling...
                    </>
                  ) : (
                    <>
                      <Zap size={14} className="mr-1" />
                      Auto-Fill
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const Icon = step.icon;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-gray-700 border-gray-600 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Icon size={16} />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-700'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2">
              <h3 className="text-white font-medium">{steps[currentStep - 1]?.title}</h3>
              <p className="text-gray-400 text-sm">Complete this step to continue</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={20} className="text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Full Name *</Label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Email Address *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Phone Number *</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Location *</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="New York, NY"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Experience */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase size={20} className="text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Work Experience</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300 mb-2 block">Years of Experience *</Label>
                      <Select value={formData.experienceYears} onValueChange={(value) => handleInputChange('experienceYears', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5-10">5-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300 mb-2 block">Current Position</Label>
                      <Input
                        value={formData.currentPosition}
                        onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-gray-300 mb-2 block">Current Company</Label>
                      <Input
                        value={formData.currentCompany}
                        onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="Tech Corp Inc."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Skills */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={20} className="text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Skills & Expertise</h3>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 mb-2 block">Add Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.newSkill}
                        onChange={(e) => handleInputChange('newSkill', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        placeholder="e.g., React, Python, AWS"
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button onClick={addSkill} className="bg-blue-600 hover:bg-blue-700">
                        <Plus size={16} />
                      </Button>
                    </div>
                  </div>
                  
                  {formData.skills.length > 0 && (
                    <div>
                      <Label className="text-gray-300 mb-2 block">Your Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <div key={index} className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/50 rounded-full px-3 py-1">
                            <span className="text-blue-300 text-sm">{skill}</span>
                            <button
                              onClick={() => removeSkill(skill)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Resume & Cover Letter */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={20} className="text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Documents</h3>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 mb-2 block">Resume *</Label>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-gray-300 mb-2">Upload your resume</p>
                      <p className="text-gray-400 text-sm mb-4">PDF, DOC, DOCX (Max 5MB)</p>
                      <input 
                        type="file" 
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <Button 
                        onClick={() => document.getElementById('resume-upload').click()}
                        variant="outline"
                        className="border-blue-500 text-blue-400 hover:bg-blue-500/20"
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-300 mb-2 block">Cover Letter</Label>
                    <Textarea 
                      value={formData.coverLetter}
                      onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      rows={6}
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle size={20} className="text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Review & Submit</h3>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-medium mb-3">Application Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{formData.fullName || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{formData.email || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{formData.phone || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{formData.location || 'Not provided'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Experience:</span>
                        <span className="text-white">{formData.experienceYears || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Position:</span>
                        <span className="text-white">{formData.currentPosition || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Company:</span>
                        <span className="text-white">{formData.currentCompany || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Skills:</span>
                        <span className="text-white">{formData.skills.length} skills added</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Education:</span>
                        <span className="text-white">{formData.education || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Resume:</span>
                        <span className="text-white">{formData.resumeFile ? 'Uploaded' : 'Not uploaded'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={16} className="text-blue-400" />
                      <span className="text-blue-300 font-medium">Ready to Apply</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      By submitting this application, you agree to our terms and conditions. 
                      Your application will be reviewed by our hiring team.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
            <div className="flex items-center justify-between gap-3">
              {/* Previous Button */}
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={16} className="mr-2" />
                Previous
              </Button>

              {/* Step Indicator */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {currentStep} of {steps.length}
                </span>
                <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Next/Submit Button */}
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Next
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || validateForm().length > 0}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} className="mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {/* Close Button */}
            <div className="mt-3 flex justify-center">
              <Button
                onClick={onClose}
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDrawer;
