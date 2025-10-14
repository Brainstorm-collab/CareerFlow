import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetJob, useUpdateJob } from "@/api/apiJobs";
import { useToast } from "../context/ToastContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  LogIn,
  ArrowLeft,
  Save
} from "lucide-react";

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "full-time",
    experienceLevel: "entry",
    remoteWork: false,
    salaryMin: "",
    salaryMax: "",
    description: "",
    requirements: "",
    benefits: [],
    status: "open",
    company_logo: null
  });
  const [newBenefit, setNewBenefit] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // Get job data
  const job = useGetJob(jobId);
  const updateJob = useUpdateJob();

  useEffect(() => {
    if (job) {
      console.log('🔍 EditJob - Job data:', job);
      console.log('🔍 EditJob - Company data:', job.company);
      console.log('🔍 EditJob - Company name:', job.company?.name);
      
      setFormData({
        title: job.title || '',
        company: job.company?.name || (typeof job.company === 'string' ? job.company : ''),
        description: job.description || '',
        requirements: job.requirements || '',
        location: job.location || '',
        jobType: job.jobType || 'full-time',
        experienceLevel: job.experienceLevel || 'entry',
        salaryMin: job.salaryMin ? job.salaryMin.toString() : '',
        salaryMax: job.salaryMax ? job.salaryMax.toString() : '',
        benefits: job.benefits ? job.benefits.split(', ').filter(b => b.trim()) : [],
        status: job.status || 'open',
        remoteWork: job.remoteWork || false,
        company_logo: null
      });
      setLoading(false);
    }
  }, [job]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRequirementsChange = (value) => {
    setFormData(prev => ({
      ...prev,
      requirements: value
    }));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !formData.benefits.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const handleRemoveBenefit = (benefitToRemove) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit !== benefitToRemove)
    }));
  };

  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const experienceLevels = ["entry", "mid", "senior", "lead"];
  const jobStatuses = ["open", "closed", "on-hold", "draft"];

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      showError('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      console.log('🔍 EditJob - Saving with formData:', formData);
      console.log('🔍 EditJob - Company name to save:', formData.company);
      
      const updateData = {
        jobId,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        status: formData.status,
        isOpen: formData.status === 'open',
        remoteWork: formData.remoteWork,
        benefits: formData.benefits.join(', '),
        companyName: formData.company // Add company name to update data
      };
      
      console.log('🔍 EditJob - Update data:', updateData);

      // Add salary fields if provided
      if (formData.salaryMin) {
        updateData.salaryMin = parseInt(formData.salaryMin);
      }
      if (formData.salaryMax) {
        updateData.salaryMax = parseInt(formData.salaryMax);
      }

      await updateJob(updateData);
      showSuccess('Job updated successfully!');
      navigate('/my-jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      showError('Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading job details...</div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
          <Button onClick={() => navigate('/my-jobs')} className="bg-purple-600 hover:bg-purple-700">
            Back to My Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter mb-4">
          Edit Job
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto">
          Update your job posting details and attract the best candidates for your team.
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
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
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

              {/* Job Status */}
              <div>
                <Label htmlFor="status" className="text-sm font-medium text-gray-300 mb-2 block">
                  Job Status
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger id="status" className="bg-white/10 border-white/20 text-white w-full md:w-48">
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
                <div>
                  <Label htmlFor="jobType" className="text-sm font-medium text-gray-300 mb-2 block">
                    Job Type
                  </Label>
                  <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                    <SelectTrigger id="jobType" className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      {jobTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type === 'full-time' ? '💼 Full-time' : 
                           type === 'part-time' ? '⏰ Part-time' : 
                           type === 'contract' ? '📋 Contract' : 
                           '🎓 Internship'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experienceLevel" className="text-sm font-medium text-gray-300 mb-2 block">
                    Experience Level
                  </Label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange('experienceLevel', value)}>
                    <SelectTrigger id="experienceLevel" className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-white/20">
                      {experienceLevels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level === 'entry' ? '🌱 Entry Level' : 
                           level === 'mid' ? '⚡ Mid Level' : 
                           level === 'senior' ? '🚀 Senior Level' : 
                           '👑 Lead Level'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="remoteWork" className="text-sm font-medium text-gray-300 mb-2 block">
                    Remote Work
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remoteWork"
                      checked={formData.remoteWork}
                      onCheckedChange={(checked) => handleInputChange('remoteWork', checked)}
                      className="border-white/20 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="remoteWork" className="text-sm text-gray-300">
                      Remote work available
                    </Label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salaryMin" className="text-sm font-medium text-gray-300 mb-2 block">
                    Minimum Salary
                  </Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                    placeholder="e.g., 50000"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="salaryMax" className="text-sm font-medium text-gray-300 mb-2 block">
                    Maximum Salary
                  </Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                    placeholder="e.g., 80000"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-300 mb-2 block">
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what makes this opportunity special..."
                  rows={6}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500 resize-none"
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirements" className="text-sm font-medium text-gray-300 mb-2 block">
                  Requirements
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleRequirementsChange(e.target.value)}
                  placeholder="List the key requirements, qualifications, and skills needed for this position..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500 resize-none"
                />
              </div>

              {/* Benefits Section */}
              <div>
                <Label className="text-sm font-medium text-gray-300 mb-2 block">
                  Benefits & Perks
                </Label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Add a benefit (e.g., Health Insurance)"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-500"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                    />
                    <Button
                      type="button"
                      onClick={handleAddBenefit}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                  {formData.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.benefits.map((benefit, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                          onClick={() => handleRemoveBenefit(benefit)}
                        >
                          {benefit}
                          <X size={12} className="ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-white/10" />

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  onClick={() => navigate('/my-jobs')}
                  variant="outline"
                  className="border-white/20 hover:bg-white/10 text-white"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save size={16} className="mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default EditJob;
