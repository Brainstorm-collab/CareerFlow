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
  Loader2
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useGetUser, useUpdateUser, useSyncUser } from "@/api/apiUsers";

const ProfilePage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Convex hooks
  const databaseUser = useGetUser(user?.id);
  const updateUser = useUpdateUser();
  const syncUser = useSyncUser();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    experienceYears: 0,
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    resumeUrl: ''
  });

  // Sync user to Convex when auth user changes
  useEffect(() => {
    const syncUserToConvex = async () => {
      if (!user) return;
      
      try {
        await syncUser({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          profileImageUrl: user.profileImageUrl,
          role: user.role || "candidate"
        });
      } catch (error) {
        console.error('Error syncing user to Convex:', error);
      }
    };

    syncUserToConvex();
  }, [user, syncUser]);

  // Update form data when database user changes
  useEffect(() => {
    if (databaseUser) {
      setFormData({
        firstName: databaseUser.firstName || user?.firstName || '',
        lastName: databaseUser.lastName || user?.lastName || '',
        email: databaseUser.email || user?.email || '',
        phone: databaseUser.phone || '',
        location: databaseUser.location || '',
        bio: databaseUser.bio || '',
        skills: databaseUser.skills || [],
        experienceYears: databaseUser.experienceYears || 0,
        linkedinUrl: databaseUser.linkedinUrl || '',
        githubUrl: databaseUser.githubUrl || '',
        portfolioUrl: databaseUser.portfolioUrl || '',
        resumeUrl: databaseUser.resumeUrl || ''
      });
      setHasUnsavedChanges(false);
    } else if (user) {
      // Fallback to auth user data
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: '',
        location: '',
        bio: '',
        skills: [],
        experienceYears: 0,
        linkedinUrl: '',
        githubUrl: '',
        portfolioUrl: '',
        resumeUrl: ''
      });
    }
  }, [databaseUser, user]);
        
        // Check localStorage for fallback data
        const localProfile = localStorage.getItem(`profile_${user.id}`);
        if (localProfile) {
          try {
            const parsedProfile = JSON.parse(localProfile);
            setFormData({
              firstName: parsedProfile.firstName || user.firstName || '',
              lastName: parsedProfile.lastName || user.lastName || '',
              email: parsedProfile.email || user.email || '',
              phone: parsedProfile.phone || '',
              location: parsedProfile.location || '',
              bio: parsedProfile.bio || '',
              skills: parsedProfile.skills || [],
              experienceYears: parsedProfile.experienceYears || 0,
              linkedinUrl: parsedProfile.linkedinUrl || '',
              githubUrl: parsedProfile.githubUrl || '',
              portfolioUrl: parsedProfile.portfolioUrl || '',
              resumeUrl: parsedProfile.resumeUrl || ''
            });
          } catch (e) {
            console.error('Error parsing local profile:', e);
          }
        } else {
          // Check localStorage for fallback data
          const localProfile = localStorage.getItem(`profile_${user.id}`);
          if (localProfile) {
            try {
              const parsedProfile = JSON.parse(localProfile);
              setFormData({
                firstName: parsedProfile.firstName || user.firstName || '',
                lastName: parsedProfile.lastName || user.lastName || '',
                email: parsedProfile.email || user.email || '',
                phone: parsedProfile.phone || '',
                location: parsedProfile.location || '',
                bio: parsedProfile.bio || '',
                skills: parsedProfile.skills || [],
                experienceYears: parsedProfile.experienceYears || 0,
                linkedinUrl: parsedProfile.linkedinUrl || '',
                githubUrl: parsedProfile.githubUrl || '',
                portfolioUrl: parsedProfile.portfolioUrl || '',
                resumeUrl: parsedProfile.resumeUrl || ''
              });
              setHasUnsavedChanges(false);
              showToast('Profile loaded from local storage', 'info');
            } catch (error) {
              console.error('Error parsing local profile:', error);
              // Fall through to default
            }
          }
          
          // If no data found anywhere, use auth data
          if (!localProfile) {
            setFormData({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || '',
              phone: '',
              location: '',
              bio: '',
              skills: [],
              experienceYears: 0,
              linkedinUrl: '',
              githubUrl: '',
              portfolioUrl: '',
              resumeUrl: ''
            });
            setHasUnsavedChanges(false);
            showToast('Welcome! Complete your profile to get started', 'info');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        showToast('An error occurred while loading profile', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, showToast]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSkillsChange = (value) => {
    const skillsArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills: skillsArray
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!user) {
      showToast('User not authenticated. Please sign in again.', 'error');
      return;
    }

    try {
      setSaving(true);
      showToast('Saving profile changes...', 'info');
      
      console.log('Saving profile data:', formData);
      console.log('User ID:', user.id);
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase not configured. Environment variables missing.');
        showToast('Database not configured. Please check environment setup.', 'error');
        
        // For now, save to localStorage as fallback
        const profileData = {
          ...formData,
          savedAt: new Date().toISOString(),
          userId: user.id
        };
        localStorage.setItem(`profile_${user.id}`, JSON.stringify(profileData));
        setHasUnsavedChanges(false);
        showToast('Profile saved locally (database not configured)', 'warning');
        return;
      }
      
      // Get Supabase client
      const supabase = await getAuthenticatedSupabaseClient();
      
      // Prepare the data to save
      const userData = {
        id: user.id,
        email: formData.email || user.email,
        first_name: formData.firstName || '',
        last_name: formData.lastName || '',
        phone: formData.phone || '',
        location: formData.location || '',
        bio: formData.bio || '',
        skills: formData.skills || [],
        experience_years: formData.experienceYears || 0,
        linkedin_url: formData.linkedinUrl || '',
        github_url: formData.githubUrl || '',
        portfolio_url: formData.portfolioUrl || '',
        resume_url: formData.resumeUrl || '',
        updated_at: new Date().toISOString()
      };

      console.log('Data being saved:', userData);
      
      // Update user data in Supabase
      const { data: updatedUser, error } = await supabase
        .from('users')
        .upsert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error updating user data:', error);
        console.error('Full error details:', error);
        
        // Try to provide more specific error messages
        let errorMessage = 'Failed to save profile';
        if (error.message.includes('relation "users" does not exist')) {
          errorMessage = 'Database table not found. Please run database setup.';
        } else if (error.message.includes('permission denied')) {
          errorMessage = 'Permission denied. Please check database permissions.';
        } else if (error.message.includes('JWT')) {
          errorMessage = 'Authentication error. Please sign in again.';
        } else {
          errorMessage = `Failed to save profile: ${error.message}`;
        }
        
        showToast(errorMessage, 'error');
        return;
      }

      console.log('Profile saved successfully:', updatedUser);
      setSupabaseUser(updatedUser);
      setHasUnsavedChanges(false);
      showToast('Profile updated successfully! 🎉', 'success');
    } catch (error) {
      console.error('Error saving profile:', error);
      console.error('Full error details:', error);
      
      let errorMessage = 'An error occurred while saving';
      if (error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message.includes('Supabase')) {
        errorMessage = 'Database connection error. Please check configuration.';
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <div className="text-white text-lg">Loading profile...</div>
        </div>
      </div>
    );
  }

  const userRole = user?.unsafeMetadata?.role || 'candidate';
  const isRecruiter = userRole === 'recruiter';

  return (
    <div className="h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/2 w-24 h-24 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                My Profile
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">Manage your personal information and preferences</p>
            </div>
          </div>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-br from-black/20 via-black/15 to-black/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        {user?.imageUrl ? (
                          <img 
                            src={user.imageUrl} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                          />
                        ) : (
                          <User size={32} className="text-white" />
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-white mb-1">
                        {formData.firstName} {formData.lastName}
                      </h2>
                      <p className="text-gray-300 mb-2">{formData.email}</p>
                      <Badge 
                        variant="outline" 
                        className={`${
                          isRecruiter 
                            ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                            : 'border-blue-500/50 text-blue-400 bg-blue-500/10'
                        }`}
                      >
                        {isRecruiter ? 'Recruiter' : 'Candidate'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Profile Details */}
              <div className="lg:col-span-2">
                <Card className="bg-gradient-to-br from-black/20 via-black/15 to-black/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-white font-bold">Profile Information</CardTitle>
                        <CardDescription className="text-gray-300">
                          Update your personal details and professional information
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          disabled={saving || !hasUnsavedChanges}
                          className={`${
                            hasUnsavedChanges 
                              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-green-500/25' 
                              : 'bg-gray-600 cursor-not-allowed'
                          } text-white transition-all duration-300`}
                        >
                          {saving ? (
                            <Loader2 size={16} className="mr-2 animate-spin" />
                          ) : (
                            <Save size={16} className="mr-2" />
                          )}
                          {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
                        </Button>
                        <Button
                          onClick={() => {
                            // Reset form data to original values
                            if (supabaseUser) {
                              setFormData({
                                firstName: supabaseUser.first_name || user.firstName || '',
                                lastName: supabaseUser.last_name || user.lastName || '',
                                email: supabaseUser.email || user.primaryEmailAddress?.emailAddress || '',
                                phone: supabaseUser.phone || '',
                                location: supabaseUser.location || '',
                                bio: supabaseUser.bio || '',
                                skills: supabaseUser.skills || [],
                                experienceYears: supabaseUser.experience_years || 0,
                                linkedinUrl: supabaseUser.linkedin_url || '',
                                githubUrl: supabaseUser.github_url || '',
                                portfolioUrl: supabaseUser.portfolio_url || '',
                                resumeUrl: supabaseUser.resume_url || ''
                              });
                            }
                            setHasUnsavedChanges(false);
                            showToast('Changes reset to saved values', 'warning');
                          }}
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400/70 transition-all duration-300"
                          disabled={!hasUnsavedChanges}
                        >
                          <X size={16} className="mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <User size={20} className="mr-2 text-blue-400" />
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-300 font-medium">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="Enter your first name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-300 font-medium">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="Enter your last name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="Enter your email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-300 font-medium">Phone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="Enter your phone number"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="location" className="text-gray-300 font-medium">Location</Label>
                          <Input
                            id="location"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="Enter your location"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Briefcase size={20} className="mr-2 text-purple-400" />
                        Professional Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="bio" className="text-gray-300 font-medium">Bio</Label>
                          <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 min-h-[100px]"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="skills" className="text-gray-300 font-medium">Skills</Label>
                          <Input
                            id="skills"
                            value={formData.skills.join(', ')}
                            onChange={(e) => handleSkillsChange(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="JavaScript, React, Node.js, Python..."
                          />
                          <p className="text-sm text-gray-400 mt-1">Separate skills with commas</p>
                        </div>
                        <div>
                          <Label htmlFor="experienceYears" className="text-gray-300 font-medium">Years of Experience</Label>
                          <Input
                            id="experienceYears"
                            type="number"
                            value={formData.experienceYears}
                            onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="Enter years of experience"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Links */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <LinkIcon size={20} className="mr-2 text-green-400" />
                        Links & Documents
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="linkedinUrl" className="text-gray-300 font-medium flex items-center">
                            <Linkedin size={16} className="mr-2 text-blue-400" />
                            LinkedIn URL
                          </Label>
                          <Input
                            id="linkedinUrl"
                            type="url"
                            value={formData.linkedinUrl}
                            onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                        <div>
                          <Label htmlFor="githubUrl" className="text-gray-300 font-medium flex items-center">
                            <Github size={16} className="mr-2 text-gray-400" />
                            GitHub URL
                          </Label>
                          <Input
                            id="githubUrl"
                            type="url"
                            value={formData.githubUrl}
                            onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="https://github.com/yourusername"
                          />
                        </div>
                        <div>
                          <Label htmlFor="portfolioUrl" className="text-gray-300 font-medium flex items-center">
                            <Globe size={16} className="mr-2 text-green-400" />
                            Portfolio URL
                          </Label>
                          <Input
                            id="portfolioUrl"
                            type="url"
                            value={formData.portfolioUrl}
                            onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="https://yourportfolio.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="resumeUrl" className="text-gray-300 font-medium flex items-center">
                            <FileText size={16} className="mr-2 text-purple-400" />
                            Resume URL
                          </Label>
                          <Input
                            id="resumeUrl"
                            type="url"
                            value={formData.resumeUrl}
                            onChange={(e) => handleInputChange('resumeUrl', e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                            placeholder="https://yourresume.com"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

