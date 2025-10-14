import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Link as LinkIcon,
  FileText,
  Github,
  Linkedin,
  Globe,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Upload,
  Download
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useGetUser, useUpdateUser, useSyncUser, useMigrateNameCustomized } from "@/api/apiUsers";
import { useGenerateUploadUrl, useUpdateFileUrl, useUploadResumeAndUpdateProfile } from "@/api/apiFileStorage";
import ManageApplicants from "@/components/manage-applicants";

const ProfilePage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [formDataReady, setFormDataReady] = useState(false);
  
  // Convex hooks
  const databaseUser = useGetUser(user?.id);
  const updateUser = useUpdateUser();
  const syncUser = useSyncUser();
  const migrateNameCustomized = useMigrateNameCustomized();
  const generateUploadUrl = useGenerateUploadUrl();
  const updateFileUrl = useUpdateFileUrl();
  const uploadResumeAndUpdateProfile = useUploadResumeAndUpdateProfile();
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Form state with proper defaults
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experienceYears: 0,
    currentPosition: '',
    currentCompany: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    resumeFile: null,
    certificates: [],
    projects: [],
    education: '',
    availability: '',
    expectedSalary: '',
    noticePeriod: ''
  });

  // Sync user to Convex when auth user changes (only if no database user exists)
  useEffect(() => {
    const syncUserToConvex = async () => {
      if (!user) return;
      
      // Only sync if we don't have a database user yet
      if (databaseUser) {
        console.log('Database user exists, skipping sync to prevent data overwrite');
        return;
      }
      
      try {
        console.log('Syncing user to Convex for the first time');
        await syncUser({
          socialId: user.id, // Use the user's ID as socialId
          provider: user.provider, // Use the provider (google, facebook, email)
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.name || `${user.firstName} ${user.lastName}`.trim(),
          profileImageUrl: user.picture,
          role: user.role || "candidate"
        });
      } catch (error) {
        console.error('Error syncing user to Convex:', error);
      }
    };

    syncUserToConvex();
  }, [user, syncUser, databaseUser]);

  // Update form data when database user changes
  useEffect(() => {
    if (databaseUser) {
      // Profile data loaded successfully
      
      // Run migration if nameCustomized is undefined
      if (databaseUser.nameCustomized === undefined) {
        console.log('Running nameCustomized migration...');
        migrateNameCustomized().then(result => {
          console.log('Migration completed:', result);
          setRefreshKey(prev => prev + 1);
        }).catch(error => {
          console.error('Migration failed:', error);
        });
      }
      
      setFormData({
        firstName: databaseUser?.firstName || user?.firstName || '',
        lastName: databaseUser?.lastName || user?.lastName || '',
        email: databaseUser?.email || user?.email || '',
        phone: databaseUser?.phone || '',
        location: databaseUser?.location || '',
        bio: databaseUser?.bio || '',
        skills: databaseUser?.skills || [],
        experienceYears: databaseUser?.experienceYears || 0,
        currentPosition: databaseUser?.currentPosition || '',
        currentCompany: databaseUser?.currentCompany || '',
        linkedinUrl: databaseUser?.linkedinUrl || '',
        githubUrl: databaseUser?.githubUrl || '',
        portfolioUrl: databaseUser?.portfolioUrl || '',
        resumeUrl: databaseUser?.resumeUrl || '',
        resumeFile: null,
        certificates: databaseUser?.certificates || [],
        projects: databaseUser?.projects || [],
        education: databaseUser?.education || '',
        availability: databaseUser?.availability || '',
        expectedSalary: databaseUser?.expectedSalary || '',
        noticePeriod: databaseUser?.noticePeriod || ''
      });
      setHasUnsavedChanges(false);
      setFormDataReady(true);
    } else if (user) {
      // Using auth user data as fallback
      
      // Fallback to auth user data
      setFormData({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        location: '',
        bio: '',
        skills: [],
        experienceYears: 0,
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        resumeUrl: '',
        resumeFile: null
      });
      setFormDataReady(true);
    }
  }, [databaseUser, user, refreshKey]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Resume file handling functions
  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        showError('Please select a PDF file for your resume.');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('Resume file size must be less than 5MB.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        resumeFile: file
      }));
      setHasUnsavedChanges(true);
    }
  };

  const handleResumeUpload = async () => {
    if (!formData.resumeFile) {
      showError('Please select a resume file first.');
      return;
    }

    setSaving(true);
    try {
      // Generate upload URL with required parameters
      const { uploadUrl } = await generateUploadUrl({
        fileName: formData.resumeFile.name,
        fileSize: formData.resumeFile.size,
        fileType: formData.resumeFile.type,
        socialId: user.id
      });
      
      // Upload file to Convex storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": formData.resumeFile.type },
        body: formData.resumeFile,
      });
      
      const { storageId } = await result.json();
      
      // Complete the resume upload process and update user profile
      const { fileUrl } = await uploadResumeAndUpdateProfile({
        socialId: user.id,
        fileName: formData.resumeFile.name,
        fileType: formData.resumeFile.type,
        fileSize: formData.resumeFile.size,
        storageId: storageId
      });
      
      // Update form data with the uploaded file URL
      setFormData(prev => ({
        ...prev,
        resumeUrl: fileUrl,
        resumeFile: null
      }));
      
      showSuccess('Resume uploaded successfully! You can now use Quick Apply.');
      setHasUnsavedChanges(true);
      
    } catch (error) {
      console.error('Resume upload error:', error);
      showError('Failed to upload resume. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!formData.resumeUrl) {
      showError('No resume available to download.');
      return;
    }

    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = formData.resumeUrl;
      link.download = `Resume_${formData.firstName || 'User'}_${new Date().getFullYear()}.pdf`;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showSuccess('Resume download started!');
    } catch (error) {
      console.error('Resume download error:', error);
      showError('Failed to download resume. Please try again.');
    }
  };

  // Function to scroll to specific field
  const scrollToField = (fieldId) => {
    console.log('Attempting to scroll to field ID:', fieldId);
    const element = document.getElementById(fieldId);
    console.log('Found element:', element);
    
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      // Add a temporary highlight effect
      element.classList.add('ring-2', 'ring-red-500', 'ring-opacity-50');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-red-500', 'ring-opacity-50');
      }, 3000);
      
      // Focus the element if it's an input
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.focus();
      }
    } else {
      console.error('Element not found with ID:', fieldId);
      // Try to find by name attribute as fallback
      const fallbackElement = document.querySelector(`[name="${fieldId}"]`);
      if (fallbackElement) {
        console.log('Found fallback element:', fallbackElement);
        fallbackElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        fallbackElement.classList.add('ring-2', 'ring-red-500', 'ring-opacity-50');
        setTimeout(() => {
          fallbackElement.classList.remove('ring-2', 'ring-red-500', 'ring-opacity-50');
        }, 3000);
        if (fallbackElement.tagName === 'INPUT' || fallbackElement.tagName === 'TEXTAREA') {
          fallbackElement.focus();
        }
      }
    }
  };

  // Field mapping for navigation
  const getFieldMapping = () => {
    return {
      'First Name': 'firstName',
      'Email Address': 'email', 
      'Phone Number': 'phone',
      'Location': 'location',
      'Skills': 'skills',
      'Resume': 'resumeFile',
      'Current Position': 'currentPosition',
      'Current Company': 'currentCompany'
    };
  };

  // Function to check if a field is missing
  const isFieldMissing = (fieldName) => {
    if (!formData) return false;
    
    const value = formData[fieldName];
    
    if (fieldName === 'skills') {
      return !Array.isArray(value) || value.length === 0;
    }
    
    if (fieldName === 'resumeUrl') {
      return !value || value.toString().trim() === '' || !value.startsWith('http');
    }
    
    return !value || value.toString().trim() === '';
  };

  // Profile validation functions
  const isProfileComplete = () => {
    if (!formData) return false;
    
    // Core required fields for all candidates
    const coreRequiredFields = [
      'firstName',
      'email',
      'phone',
      'location',
      'skills',
      'resumeUrl'
    ];
    
    // Check core fields
    const coreFieldsComplete = coreRequiredFields.every(field => {
      const value = formData[field];
      if (field === 'skills') {
        return Array.isArray(value) && value.length > 0;
      }
      if (field === 'resumeUrl') {
        return value && value.toString().trim() !== '' && value.startsWith('http');
      }
      return value && value.toString().trim() !== '';
    });
    
    // For experienced candidates (1+ years), also require position and company
    const isExperienced = formData.experienceYears && parseInt(formData.experienceYears) >= 1;
    
    if (isExperienced) {
      const experienceFields = ['currentPosition', 'currentCompany'];
      const experienceFieldsComplete = experienceFields.every(field => {
        const value = formData[field];
        return value && value.toString().trim() !== '';
      });
      return coreFieldsComplete && experienceFieldsComplete;
    }
    
    // For freshers (0 years or no experience), only core fields are required
    return coreFieldsComplete;
  };

  const getMissingFields = () => {
    if (!formData) return ['Profile not found'];
    
    const coreRequiredFields = {
      'firstName': 'First Name',
      'email': 'Email Address',
      'phone': 'Phone Number',
      'location': 'Location',
      'skills': 'Skills',
      'resumeUrl': 'Resume'
    };
    
    const missing = [];
    
    // Check core required fields
    Object.entries(coreRequiredFields).forEach(([field, label]) => {
      const value = formData[field];
      if (field === 'skills') {
        if (!Array.isArray(value) || value.length === 0) {
          missing.push(label);
        }
      } else if (field === 'resumeUrl') {
        if (!value || value.toString().trim() === '' || !value.startsWith('http')) {
          missing.push(label);
        }
      } else if (!value || value.toString().trim() === '') {
        missing.push(label);
      }
    });
    
    // For experienced candidates, also check experience fields
    const isExperienced = formData.experienceYears && parseInt(formData.experienceYears) >= 1;
    
    if (isExperienced) {
      const experienceFields = {
        'currentPosition': 'Current Position',
        'currentCompany': 'Current Company'
      };
      
      Object.entries(experienceFields).forEach(([field, label]) => {
        const value = formData[field];
        if (!value || value.toString().trim() === '') {
          missing.push(label);
        }
      });
    }
    
    return missing;
  };

  const getCompletionPercentage = () => {
    if (!formData) return 0;
    
    // Core required fields for all candidates
    const coreRequiredFields = [
      'firstName',
      'email',
      'phone',
      'location',
      'skills',
      'resumeUrl'
    ];
    
    // Check core fields
    const completedCoreFields = coreRequiredFields.filter(field => {
      const value = formData[field];
      if (field === 'skills') {
        return Array.isArray(value) && value.length > 0;
      }
      if (field === 'resumeUrl') {
        return value && value.toString().trim() !== '' && value.startsWith('http');
      }
      return value && value.toString().trim() !== '';
    });
    
    // For experienced candidates, also include experience fields
    const isExperienced = formData.experienceYears && parseInt(formData.experienceYears) >= 1;
    
    if (isExperienced) {
      const experienceFields = ['currentPosition', 'currentCompany'];
      const completedExperienceFields = experienceFields.filter(field => {
        const value = formData[field];
        return value && value.toString().trim() !== '';
      });
      
      const totalFields = coreRequiredFields.length + experienceFields.length;
      const completedFields = completedCoreFields.length + completedExperienceFields.length;
      return Math.round((completedFields / totalFields) * 100);
    }
    
    // For freshers, only core fields count
    return Math.round((completedCoreFields.length / coreRequiredFields.length) * 100);
  };

  // Image upload functions
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      // Generate upload URL
      const { uploadUrl, fileId } = await generateUploadUrl({
        socialId: user.id,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      });

      // Upload the file
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { storageId } = await uploadResponse.json();

      // Update file URL
      const updateResult = await updateFileUrl({
        fileId: fileId,
        storageId: storageId,
      });

      // Update user profile with new image URL
      await updateUser({
        userId: databaseUser._id,
        profileImageUrl: updateResult.fileUrl
      });

      setImagePreview(updateResult.fileUrl);
      showSuccess('Profile image updated successfully!');
      setRefreshKey(prev => prev + 1); // Refresh user data
      
      // Clear imagePreview after a delay to let the database update
      setTimeout(() => {
        setImagePreview(null);
      }, 2000);
    } catch (error) {
      console.error('Error uploading image:', error);
      showError('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!databaseUser?.profileImageUrl && !imagePreview) return;

    try {
      await updateUser({
        userId: databaseUser._id,
        profileImageUrl: ''
      });

      setImagePreview(null);
      showSuccess('Profile image removed successfully!');
      setRefreshKey(prev => prev + 1); // Refresh user data
    } catch (error) {
      console.error('Error deleting image:', error);
      showError('Failed to remove image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!user) {
      showError('You must be logged in to save your profile');
      return;
    }
    
    if (!databaseUser) {
      showError('User profile not found. Please refresh the page.');
      return;
    }
    
    setSaving(true);
    try {
      const result = await updateUser({
        userId: databaseUser._id, // Use the Convex document ID
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        skills: formData.skills,
        experienceYears: formData.experienceYears,
        currentPosition: formData.currentPosition,
        currentCompany: formData.currentCompany,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        portfolioUrl: formData.portfolioUrl,
        resumeUrl: formData.resumeUrl && formData.resumeUrl.startsWith('http') ? formData.resumeUrl : '',
        certificates: formData.certificates,
        projects: formData.projects,
        education: formData.education,
        availability: formData.availability,
        expectedSalary: formData.expectedSalary,
        noticePeriod: formData.noticePeriod
      });
      
      showSuccess('Profile saved successfully! 🎉');
      setHasUnsavedChanges(false);
      
      // Force refresh the user data
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error saving profile:', error);
      showError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (skill) => {
    if (skill.trim() && !formData.skills.includes(skill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
      setHasUnsavedChanges(true);
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
    setHasUnsavedChanges(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
            <p className="text-gray-600">You need to be signed in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
          {user && !databaseUser && (
            <div className="mt-4">
              <p className="text-yellow-400 mb-2">Profile data not found. You may need to sync your account.</p>
              <Button
                onClick={async () => {
                  try {
                    console.log('🔄 Manual sync triggered');
                    const result = await syncUser({
                      socialId: user.id,
                      provider: 'clerk',
                      email: user.emailAddresses[0]?.emailAddress || '',
                      firstName: user.firstName || '',
                      lastName: user.lastName || '',
                      fullName: user.fullName || '',
                      profileImageUrl: user.imageUrl || '',
                    });
                    showSuccess('Account synced successfully!');
                    setRefreshKey(prev => prev + 1);
                  } catch (error) {
                    console.error('Sync error:', error);
                    showError('Failed to sync account. Please try again.');
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sync Account
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const loading = databaseUser === undefined;

  // Check if user is a recruiter
  const isRecruiter = databaseUser?.role === "recruiter";

  // If user is a recruiter, show Manage Applicants instead of profile form
  if (isRecruiter) {
    return <ManageApplicants />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Blur Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header with Save Button */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <User size={24} className="text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
              </div>
              <p className="text-gray-400 text-lg max-w-2xl">
                Manage your personal information and preferences
              </p>
            </div>
            
            {/* Top Save Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-amber-400 text-sm">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  Unsaved changes
                </div>
              )}
              <Button
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 min-w-[140px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {loading || !formDataReady ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-400">Loading profile...</span>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Profile Header */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative group">
                    {(() => {
                      const imageUrl = imagePreview || databaseUser?.profileImageUrl || user?.picture;
                      // Rendering profile image
                      
                      return imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Profile"
                          className="w-24 h-24 rounded-full border-3 border-white/20 object-cover shadow-lg"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                          onLoad={() => {
                            // Profile image loaded successfully
                          }}
                          onError={(e) => {
                            console.error('Profile image failed to load:', imageUrl);
                            // Replace with fallback instead of hiding
                            const fallback = document.createElement('div');
                            fallback.className = 'w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-white/20';
                            fallback.innerHTML = '<svg class="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>';
                            e.target.parentNode.replaceChild(fallback, e.target);
                          }}
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-3 border-white/20 shadow-lg">
                          <User className="h-12 w-12 text-white" />
                        </div>
                      );
                    })()}
                    
                    {/* Upload Loading Overlay */}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Image Action Buttons */}
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="profile-image-upload"
                      disabled={uploadingImage}
                    />
                    <Button
                      asChild
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <label htmlFor="profile-image-upload" className="cursor-pointer">
                        <Edit3 size={14} className="mr-1" />
                        Edit
                      </label>
                    </Button>
                    <Button
                      onClick={handleDeleteImage}
                      size="sm"
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={uploadingImage}
                    >
                      <X size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                  {/* Profile Info Section */}
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      {formData.firstName} {formData.lastName}
                    </h2>
                    <p className="text-gray-400 text-lg mb-4">{formData.email}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      <Badge variant="secondary" className="bg-blue-100/20 text-blue-300 border-blue-400/30 px-3 py-1">
                        <User className="h-3 w-3 mr-1" />
                        {databaseUser?.role || 'candidate'}
                      </Badge>
                      {isProfileComplete() ? (
                        <Badge variant="secondary" className="bg-green-100/20 text-green-300 border-green-400/30 px-3 py-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Profile Complete
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-amber-100/20 text-amber-300 border-amber-400/30 px-3 py-1">
                          <Target className="h-3 w-3 mr-1" />
                          {getCompletionPercentage()}% Complete
                        </Badge>
                      )}
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{formData.experienceYears}</div>
                        <div className="text-xs text-gray-400">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{formData.skills?.length || 0}</div>
                        <div className="text-xs text-gray-400">Skills</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{formData.projects?.length || 0}</div>
                        <div className="text-xs text-gray-400">Projects</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white">{formData.certificates?.length || 0}</div>
                        <div className="text-xs text-gray-400">Certificates</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Profile Completion Status */}
            <Card className={`backdrop-blur-sm border-2 ${
              isProfileComplete() 
                ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30' 
                : 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {isProfileComplete() ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : (
                    <Target className="h-5 w-5 text-yellow-400" />
                  )}
                  Quick Apply Status
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {isProfileComplete() 
                    ? 'Your profile is ready for Quick Apply!' 
                    : formData.experienceYears && parseInt(formData.experienceYears) >= 1
                      ? 'Complete your profile including resume upload to enable Quick Apply feature'
                      : 'Complete your basic profile including resume upload to enable Quick Apply (experience fields are optional for freshers)'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Profile Completion</span>
                      <span className="text-sm text-gray-400">{getCompletionPercentage()}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          isProfileComplete() 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                        }`}
                        style={{ width: `${getCompletionPercentage()}%` }}
                      />
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3">
                    {isProfileComplete() ? (
                      <Badge className="bg-green-500/20 border-green-500/50 text-green-300 px-3 py-1">
                        <div className="flex items-center gap-2">
                          <Zap size={14} />
                          Ready for Quick Apply
                        </div>
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 px-3 py-1">
                        <div className="flex items-center gap-2">
                          <AlertCircle size={14} />
                          Profile Incomplete
                        </div>
                      </Badge>
                    )}
                  </div>

                  {/* Missing Fields */}
                  {!isProfileComplete() && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <h4 className="text-yellow-300 font-medium mb-2 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Missing Required Fields
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {getMissingFields().map((field, index) => (
                          <Badge key={index} className="bg-yellow-500/20 border-yellow-500/50 text-yellow-300 text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Quick Fill Buttons */}
                      <div className="space-y-2">
                        <p className="text-yellow-200 text-sm font-medium">Quick Fill Missing Fields:</p>
                        <div className="flex flex-wrap gap-2">
                          {getMissingFields().map((field, index) => {
                            const fieldMapping = getFieldMapping();
                            const fieldId = fieldMapping[field] || field.toLowerCase().replace(/\s+/g, '');
                            
                            return (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  console.log('Navigating to field:', field, 'ID:', fieldId);
                                  scrollToField(fieldId);
                                }}
                                className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20 text-xs"
                              >
                                <Edit3 size={12} className="mr-1" />
                                Fill {field}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <p className="text-yellow-200 text-sm mt-3">
                        {formData.experienceYears && parseInt(formData.experienceYears) >= 1
                          ? 'Fill in these fields including resume upload to enable Quick Apply functionality'
                          : 'Fill in the required fields including resume upload to enable Quick Apply. Experience fields are optional for freshers.'
                        }
                      </p>
                    </div>
                  )}

                  {/* Quick Apply Benefits */}
                  {isProfileComplete() && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <h4 className="text-green-300 font-medium mb-2 flex items-center gap-2">
                        <Zap size={16} />
                        Quick Apply Benefits
                      </h4>
                      <ul className="text-green-200 text-sm space-y-1">
                        <li>• One-click job applications</li>
                        <li>• Auto-generated cover letters</li>
                        <li>• Instant application submission</li>
                        <li>• Real-time application tracking</li>
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your basic personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300 flex items-center gap-2">
                      First Name
                      <span className="text-red-400 text-xs">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`bg-white/5 text-white transition-all duration-300 ${
                        isFieldMissing('firstName') 
                          ? 'border-red-500/70 bg-red-500/5 focus:border-red-400 focus:ring-red-500/20' 
                          : 'border-green-500/50 focus:border-green-400 focus:ring-green-500/20'
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300 flex items-center gap-2">
                      Last Name
                      <span className="text-blue-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-800/50 border-gray-600 text-gray-400"
                  />
                  <p className="text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                      Phone
                      <span className="text-red-400 text-xs">*</span>
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`bg-white/5 text-white transition-all duration-300 ${
                        isFieldMissing('phone') 
                          ? 'border-red-500/70 bg-red-500/5 focus:border-red-400 focus:ring-red-500/20' 
                          : 'border-green-500/50 focus:border-green-400 focus:ring-green-500/20'
                      }`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300 flex items-center gap-2">
                      Location
                      <span className="text-red-400 text-xs">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className={`bg-white/5 text-white transition-all duration-300 ${
                        isFieldMissing('location') 
                          ? 'border-red-500/70 bg-red-500/5 focus:border-red-400 focus:ring-red-500/20' 
                          : 'border-green-500/50 focus:border-green-400 focus:ring-green-500/20'
                      }`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="bg-white/5 border-white/20 text-white min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your work experience and skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experienceYears" className="text-gray-300">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    value={formData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    Skills
                    <span className="text-red-400 text-xs">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Input
                    id="skills"
                    value=""
                    placeholder="Add a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className={`bg-white/5 text-white transition-all duration-300 ${
                      isFieldMissing('skills') 
                        ? 'border-red-500/70 bg-red-500/5 focus:border-red-400 focus:ring-red-500/20' 
                        : 'border-green-500/50 focus:border-green-400 focus:ring-green-500/20'
                    }`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <LinkIcon className="h-5 w-5" />
                  Social Links
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your online presence and portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl" className="text-gray-300 flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="githubUrl" className="text-gray-300 flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Label>
                  <Input
                    id="githubUrl"
                    value={formData.githubUrl}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl" className="text-gray-300 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Portfolio Website
                  </Label>
                  <Input
                    id="portfolioUrl"
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumeUrl" className="text-gray-300 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Resume URL
                  </Label>
                  <Input
                    id="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow valid URLs or empty string
                      if (value === '' || value.startsWith('http')) {
                        handleInputChange('resumeUrl', value);
                      }
                    }}
                    placeholder="https://yourresume.com"
                    className="bg-white/5 border-white/20 text-white"
                    type="url"
                  />
                </div>

                {/* Resume File Upload Section */}
                <div className="space-y-2">
                  <Label className="text-gray-300 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Upload Resume PDF
                    <Badge variant="destructive" className="text-xs">Required for Quick Apply</Badge>
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Input
                        id="resumeFile"
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeFileChange}
                        className={`bg-white/5 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:text-sm transition-all duration-300 ${
                          isFieldMissing('resumeUrl') 
                            ? 'border-red-500/70 bg-red-500/5 focus:border-red-400 focus:ring-red-500/20' 
                            : 'border-green-500/50 focus:border-green-400 focus:ring-green-500/20'
                        }`}
                      />
                      {formData.resumeFile && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleResumeUpload}
                          disabled={saving}
                          className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Upload className="h-4 w-4 mr-2" />
                          )}
                          Upload
                        </Button>
                      )}
                    </div>
                    {formData.resumeFile && (
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Selected: {formData.resumeFile.name}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">
                          Click "Upload" to save this resume for Quick Apply functionality.
                        </p>
                      </div>
                    )}
                    {formData.resumeUrl && formData.resumeUrl.startsWith('http') && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-400">
                            <LinkIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">Current Resume</span>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDownloadResume}
                            className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                        <p className="text-gray-400 text-xs mt-1 break-all">
                          {formData.resumeUrl}
                        </p>
                      </div>
                    )}
                    <p className="text-gray-400 text-xs">
                      💡 Upload a PDF resume to enable Quick Apply functionality. This will be used when applying to jobs.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Experience */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Briefcase className="h-5 w-5" />
                  Professional Experience
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your current work experience and position
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPosition" className="text-gray-300 flex items-center gap-2">
                      Current Position
                      <span className="text-blue-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="currentPosition"
                      value={formData.currentPosition}
                      onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                      placeholder="Software Engineer"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentCompany" className="text-gray-300 flex items-center gap-2">
                      Current Company
                      <span className="text-blue-400 text-xs">(Optional)</span>
                    </Label>
                    <Input
                      id="currentCompany"
                      value={formData.currentCompany}
                      onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                      placeholder="Tech Corp Inc."
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experienceYears" className="text-gray-300 flex items-center gap-2">
                    Years of Experience
                    <span className="text-blue-400 text-xs">(Optional)</span>
                  </Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                    placeholder="0 (for freshers)"
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <p className="text-xs text-gray-400">
                    Enter 0 if you're a fresher or recent graduate
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Education & Certificates */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  Education & Certificates
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your educational background and professional certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="education" className="text-gray-300">Education Level</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="Bachelor's in Computer Science"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Certificates</Label>
                  <Textarea
                    value={formData.certificates ? formData.certificates.join('\n') : ''}
                    onChange={(e) => handleInputChange('certificates', e.target.value.split('\n').filter(Boolean))}
                    placeholder="AWS Certified Solutions Architect&#10;Google Cloud Professional&#10;Microsoft Azure Fundamentals"
                    className="bg-white/5 border-white/20 text-white"
                    rows={4}
                  />
                  <p className="text-gray-400 text-sm">Enter each certificate on a new line</p>
                </div>
              </CardContent>
            </Card>

            {/* Projects & Portfolio */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Globe className="h-5 w-5" />
                  Projects & Portfolio
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Showcase your projects and portfolio work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Projects</Label>
                  <Textarea
                    value={formData.projects ? formData.projects.join('\n') : ''}
                    onChange={(e) => handleInputChange('projects', e.target.value.split('\n').filter(Boolean))}
                    placeholder="E-commerce Platform - React, Node.js, MongoDB&#10;Task Management App - Vue.js, Express, PostgreSQL&#10;AI Chatbot - Python, TensorFlow, Flask"
                    className="bg-white/5 border-white/20 text-white"
                    rows={4}
                  />
                  <p className="text-gray-400 text-sm">Enter each project on a new line with description and technologies</p>
                </div>
              </CardContent>
            </Card>

            {/* Job Preferences */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5" />
                  Job Preferences
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your availability and salary expectations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availability" className="text-gray-300">Availability</Label>
                    <Input
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => handleInputChange('availability', e.target.value)}
                      placeholder="Immediate / 2 weeks notice"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedSalary" className="text-gray-300">Expected Salary</Label>
                    <Input
                      id="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                      placeholder="$80,000 - $100,000"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="noticePeriod" className="text-gray-300">Notice Period</Label>
                  <Input
                    id="noticePeriod"
                    value={formData.noticePeriod}
                    onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                    placeholder="2 weeks / 1 month"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  console.log('Manual refresh clicked');
                  setRefreshKey(prev => prev + 1);
                }}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Refresh Data
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
