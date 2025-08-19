import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  FileText, 
  Plus, 
  X, 
  Eye,
  EyeOff,
  Sparkles,
  PenBox,
  Lock,
  User,
  LogIn
} from "lucide-react";
import { useUser, SignedOut } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Link, Navigate } from "react-router-dom";
import { postJob } from "@/utils/local-storage-service";
import { useJobContext } from "@/context/JobContext";
import { useToast } from "@/context/ToastContext";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "full-time",
    experience_level: "entry",
    remote_work: false,
    salary_min: "",
    salary_max: "",
    description: "",
    requirements: "",
    benefits: [],
    status: "open", // New: job status
    company_logo: null // New: company logo file
  });
  const [newBenefit, setNewBenefit] = useState("");
  const [showPreview, setSetShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null); // New: logo preview
  const { user } = useUser();
  const { addNewJob } = useJobContext();
  const { showSuccess, showError } = useToast();

  // Debug information for development
  const debugInfo = {
    userId: user?.id,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    userRole: user?.unsafeMetadata?.role,
    hasUnsafeMetadata: !!user?.unsafeMetadata,
    unsafeMetadataKeys: user?.unsafeMetadata ? Object.keys(user?.unsafeMetadata) : [],
    isSignedIn: !!user,
    userObject: user
  };

  // Show debug info in development mode
  const isDevelopment = import.meta.env.MODE === 'development';

  // Check if user is not logged in - this should not happen due to ProtectedRoute
  if (!user) {
    return <Navigate to="/?sign-in=true" replace />;
  }

  // Check if user role is not set yet (needs onboarding)
  if (!user?.unsafeMetadata?.role) {
    return <Navigate to="/onboarding" replace />;
  }

  // Check if user is a candidate (candidates cannot post jobs)
  if (user?.unsafeMetadata?.role === "candidate") {
    return <Navigate to="/unauthorized" replace />;
  }

  // Only recruiters can access the job posting form
  // Users without roles need to complete onboarding first

  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const experienceLevels = ["entry", "mid", "senior", "lead"];
  const jobStatuses = ["open", "closed", "on-hold", "draft"]; // New: job status options

  const jobTemplates = [
    {
      name: "Software Engineer",
      data: {
        title: "Software Engineer",
        description: "We are looking for a talented Software Engineer to join our team and help build innovative solutions. You will work on cutting-edge technologies and collaborate with cross-functional teams to deliver high-quality software products.",
        requirements: "# Responsibilities\n- Develop and maintain software applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code\n- Participate in code reviews\n- Troubleshoot and debug issues",
        benefits: ["Health Insurance", "PF & Gratuity", "Remote Work", "Flexible Hours", "Professional Development"]
      }
    },
    {
      name: "Marketing Manager",
      data: {
        title: "Marketing Manager",
        description: "Join our marketing team to develop and execute comprehensive marketing strategies. You will lead campaigns, manage brand awareness, and drive customer acquisition through innovative marketing initiatives.",
        requirements: "# Responsibilities\n- Develop marketing strategies\n- Manage brand awareness\n- Lead marketing campaigns\n- Analyze market trends\n- Coordinate with creative teams",
        benefits: ["Health Insurance", "Dental Coverage", "Vision Coverage", "Paid Time Off", "Performance Bonus"]
      }
    },
    {
      name: "Data Analyst",
      data: {
        title: "Data Analyst",
        description: "We are seeking a Data Analyst to transform complex data into actionable insights. You will work with stakeholders across the organization to identify trends, create reports, and support data-driven decision making.",
        requirements: "# Responsibilities\n- Analyze complex datasets\n- Create data visualizations\n- Generate insights and reports\n- Support decision making\n- Maintain data quality",
        benefits: ["Health Insurance", "PF & Gratuity", "Remote Work", "Conference Budget", "Professional Development"]
      }
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      ...template.data,
      company: prev.company,
      location: prev.location
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const removeBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  // New: Handle logo file upload
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showError('Please select a valid image file (PNG, JPG, JPEG, or WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
      }

      setFormData(prev => ({ ...prev, company_logo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // New: Remove logo
  const removeLogo = () => {
    setFormData(prev => ({ ...prev, company_logo: null }));
    setLogoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        company: { 
          name: formData.company || 'Unknown Company',
          logo: logoPreview || null // Include logo preview if available
        },
        job_type: formData.job_type,
        experience_level: formData.experience_level,
        remote_work: formData.remote_work,
        salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
        benefits: formData.benefits,
        status: formData.status, // New: job status
        isOpen: formData.status === 'open' // Only open jobs are visible to candidates
      };

      console.log('About to post job with data:', jobData);
      console.log('Logo preview available:', !!logoPreview);
      console.log('Logo preview data:', logoPreview);
      console.log('Company data:', jobData.company);
      
      const result = postJob(jobData, user.id);
      
      if (result.success) {
        console.log('Job posted successfully:', result.data);
        console.log('Stored job data:', result.data);
        
        // Add the new job to the global jobs list for instant display
        const newJob = {
          id: result.data.id, // Use the ID from the postJob result
          ...jobData,
          created_at: new Date().toISOString(),
          recruiter_id: user.id,
          applicantsCount: 0 // Initialize applicant count
        };
        addNewJob(newJob);
        
        setSuccess(true);
        setFormData({
          title: "",
          company: "",
          location: "",
          job_type: "full-time",
          experience_level: "entry",
          remote_work: false,
          salary_min: "",
          salary_max: "",
          description: "",
          requirements: "",
          benefits: [],
          status: "open", // New: job status
          company_logo: null // New: company logo file
        });
        setLogoPreview(null);
      } else {
        throw new Error(result.message || 'Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      showError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles size={32} className="text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Job Posted Successfully!</h1>
              <p className="text-gray-300 mb-8">
                Your job posting has been published and is now visible to potential candidates.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setSuccess(false)} variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                  Post Another Job
                </Button>
                <Button onClick={() => window.location.href = '/jobs'} className="bg-blue-600 hover:bg-blue-700">
                  View All Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter mb-4">
          Post a Job
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto">
          Find the perfect candidate for your team. Create compelling job postings 
          that attract top talent from around the world.
        </p>
      </section>

      <div className="max-w-6xl mx-auto">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <PenBox size={24} className="text-blue-400" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Templates */}
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-3 block">
                  Quick Templates
                </Label>
                <div className="flex flex-wrap gap-2">
                  {jobTemplates.map((template, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleTemplateSelect(template)}
                      className="border-white/20 hover:bg-white/10 text-white"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-300 mb-2 block">
                    Job Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Frontend Developer"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-gray-300 mb-2 block">
                    Company Name *
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="e.g., META"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Company Logo Upload */}
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-2 block">
                  Company Logo
                </Label>
                <div className="flex items-center gap-4">
                  {logoPreview ? (
                    <div className="relative">
                      <img 
                        src={logoPreview} 
                        alt="Company logo preview" 
                        className="w-20 h-20 object-cover rounded-lg border border-white/20"
                      />
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-white/40 text-xs text-center">No logo</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <PenBox size={16} />
                      {logoPreview ? 'Change Logo' : 'Upload Logo'}
                    </label>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, JPEG, WebP up to 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Status */}
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-300 mb-2 block">
                  Job Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white w-full md:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/20">
                    {jobStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status === 'open' ? '🟢 Open' : 
                         status === 'closed' ? '🔴 Closed' : 
                         status === 'on-hold' ? '🟡 On Hold' : 
                         '📝 Draft'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400 mt-1">
                  {formData.status === 'open' && 'Job is visible to candidates and accepting applications'}
                  {formData.status === 'closed' && 'Job is no longer accepting applications'}
                  {formData.status === 'on-hold' && 'Job is temporarily paused'}
                  {formData.status === 'draft' && 'Job is saved but not published'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-gray-300 mb-2 block">
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Goa"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="job_type" className="text-sm font-medium text-gray-300 mb-2 block">
                      Job Type
                    </Label>
                    <Select value={formData.job_type} onValueChange={(value) => handleInputChange('job_type', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20">
                        {jobTypes.map(type => (
                          <SelectItem key={type} value={type}>{type.replace('-', ' ')}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="experience_level" className="text-sm font-medium text-gray-300 mb-2 block">
                      Experience Level
                    </Label>
                    <Select value={formData.experience_level} onValueChange={(value) => handleInputChange('experience_level', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-white/20">
                        {experienceLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote_work"
                  checked={formData.remote_work}
                  onCheckedChange={(checked) => handleInputChange('remote_work', checked)}
                  className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="remote_work" className="text-sm font-medium text-gray-300">
                  Remote work available
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salary_min" className="text-sm font-medium text-gray-300 mb-2 block">
                    Minimum Salary (INR)
                  </Label>
                  <Input
                    id="salary_min"
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => handleInputChange('salary_min', e.target.value)}
                    placeholder="e.g., 500000"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="salary_max" className="text-sm font-medium text-gray-300 mb-2 block">
                    Maximum Salary (INR)
                  </Label>
                  <Input
                    id="salary_max"
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => handleInputChange('salary_max', e.target.value)}
                    placeholder="e.g., 1500000"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Job Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-300 mb-2 block">
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  rows={6}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                  required
                />
              </div>

              {/* Requirements with Markdown Editor */}
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-2 block">
                  Requirements & Responsibilities *
                </Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-400 mb-2 block">Markdown Input</Label>
                    <div data-color-mode="dark">
                      <MDEditor
                        value={formData.requirements}
                        onChange={(value) => handleInputChange('requirements', value || '')}
                        preview="edit"
                        height={300}
                        className="bg-white/10 border border-white/20 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400 mb-2 block">Preview</Label>
                    <div className="bg-white/10 border border-white/20 rounded-md p-4 h-[300px] overflow-y-auto">
                      <MDEditor.Markdown 
                        source={formData.requirements || '# Enter requirements here...'} 
                        className="bg-transparent text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-2 block">
                  Benefits & Perks
                </Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add a benefit (e.g., Health Insurance)"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                  />
                  <Button
                    type="button"
                    onClick={addBenefit}
                    variant="outline"
                    size="icon"
                    className="border-white/20 hover:bg-white/10 text-white"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                    >
                      {benefit}
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="ml-2 hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Posting Job...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <PenBox size={20} />
                    Submit Job
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer Attribution */}
      {/* <div className="text-center py-8 mt-16">
        <p className="text-gray-400 text-sm">
          Made with 💗 by G.Eesaan
        </p>
      </div> */}
    </main>
  );
};

export default PostJob;
