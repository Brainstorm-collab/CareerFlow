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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveProfile = async () => {
    if (!user) {
      showToast('You must be logged in to save your profile', 'error');
      return;
    }
    
    setSaving(true);
    try {
      await updateUser({
        userId: user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        skills: formData.skills,
        experienceYears: formData.experienceYears,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        portfolioUrl: formData.portfolioUrl,
        resumeUrl: formData.resumeUrl && formData.resumeUrl.startsWith('http') ? formData.resumeUrl : ''
      });
      
      showToast('Profile saved successfully', 'success');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Failed to save profile', 'error');
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

  const loading = databaseUser === undefined;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-400">Manage your personal information and preferences</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-400">Loading profile...</span>
          </div>
        ) : (
          <div className="space-y-6">
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
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
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
                    <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
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
                  <Label className="text-gray-300">Skills</Label>
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
                    placeholder="Add a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="bg-white/5 border-white/20 text-white"
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
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveProfile}
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

