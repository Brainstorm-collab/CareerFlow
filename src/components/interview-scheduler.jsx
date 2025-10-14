import { useState, useEffect } from "react";
// Removed Card imports as we're using custom div structure
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Users, 
  X, 
  Send,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Building2,
  FileText,
  ArrowRight,
  ArrowLeft,
  Star,
  Zap,
  Shield,
  Globe
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useNotifications } from "@/context/NotificationContext";

const InterviewScheduler = ({ 
  isOpen, 
  onClose, 
  candidate, 
  job, 
  onSchedule 
}) => {
  const { showSuccess, showError } = useToast();
  const { createInterviewNotification, createStatusUpdateNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '60',
    type: '',
    location: '',
    meetingLink: '',
    interviewer: '',
    notes: '',
    reminder: '24',
    timezone: 'UTC'
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: '',
        time: '',
        duration: '60',
        type: '',
        location: '',
        meetingLink: '',
        interviewer: '',
        notes: '',
        reminder: '24',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      });
      setStep(1);
      setLoading(false);
      setErrors({});
      setIsValidating(false);
    }
  }, [isOpen]);

  const interviewTypes = [
    { 
      value: 'video', 
      label: 'Video Call', 
      icon: Video, 
      description: 'Online video interview via Zoom, Teams, or Google Meet',
      color: 'blue',
      popular: true
    },
    { 
      value: 'phone', 
      label: 'Phone Call', 
      icon: Phone, 
      description: 'Traditional phone interview',
      color: 'green'
    },
    { 
      value: 'in-person', 
      label: 'In-Person', 
      icon: MapPin, 
      description: 'Face-to-face meeting at office location',
      color: 'red'
    },
    { 
      value: 'panel', 
      label: 'Panel Interview', 
      icon: Users, 
      description: 'Multiple interviewers in one session',
      color: 'purple'
    }
  ];

  const durations = [
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' }
  ];

  const reminders = [
    { value: '1', label: '1 hour before' },
    { value: '24', label: '1 day before' },
    { value: '48', label: '2 days before' },
    { value: '168', label: '1 week before' }
  ];

  const handleInputChange = (field, value) => {
    // Ensure time format is correct
    if (field === 'time' && value && !value.includes(':')) {
      // If time doesn't have colon, try to format it
      if (value.length === 4) {
        value = value.substring(0, 2) + ':' + value.substring(2);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.date) {
      newErrors.date = "Please select an interview date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = "Please select a future date";
      }
    }
    
    if (!formData.time) {
      newErrors.time = "Please select an interview time";
    }
    
    if (!formData.duration) {
      newErrors.duration = "Please select interview duration";
    }
    
    // Check if date and time combination is in the future
    if (formData.date && formData.time) {
      const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
      if (selectedDateTime <= new Date()) {
        newErrors.time = "Please select a future time";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.type) {
      newErrors.type = "Please select an interview type";
    }
    
    if (formData.type === 'video' && !formData.meetingLink) {
      newErrors.meetingLink = "Please provide a meeting link for video interviews";
    } else if (formData.type === 'video' && formData.meetingLink) {
      // Basic URL validation
      try {
        new URL(formData.meetingLink);
      } catch {
        newErrors.meetingLink = "Please enter a valid meeting link";
      }
    }
    
    if (formData.type === 'in-person' && !formData.location) {
      newErrors.location = "Please provide a location for in-person interviews";
    }
    
    if (formData.interviewer && formData.interviewer.trim().length < 2) {
      newErrors.interviewer = "Interviewer name must be at least 2 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setIsValidating(true);
    
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        setErrors({});
      } else {
        showError("Please fix the errors before proceeding");
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
        setErrors({});
      } else {
        showError("Please fix the errors before proceeding");
      }
    }
    
    setTimeout(() => setIsValidating(false), 500);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSchedule = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.date || !formData.time) {
        showError("Please select a date and time for the interview");
        setLoading(false);
        return;
      }

      // Debug logging
      console.log('Interview scheduling data:', {
        date: formData.date,
        time: formData.time,
        formData: formData
      });

      // Create and validate the scheduled date
      let timeValue = formData.time;
      
      // Ensure time has proper format (HH:MM)
      if (timeValue && !timeValue.includes(':')) {
        if (timeValue.length === 4) {
          timeValue = timeValue.substring(0, 2) + ':' + timeValue.substring(2);
        } else if (timeValue.length === 3) {
          timeValue = '0' + timeValue.substring(0, 1) + ':' + timeValue.substring(1);
        }
      }
      
      const dateTimeString = `${formData.date}T${timeValue}`;
      const scheduledDateTime = new Date(dateTimeString);
      
      if (isNaN(scheduledDateTime.getTime())) {
        console.error('Invalid date created from:', {
          originalDate: formData.date,
          originalTime: formData.time,
          formattedTime: timeValue,
          dateTimeString: dateTimeString,
          scheduledDateTime: scheduledDateTime
        });
        showError("Invalid date or time selected. Please check your input.");
        setLoading(false);
        return;
      }

      // Check if the date is in the future
      if (scheduledDateTime <= new Date()) {
        showError("Please select a future date and time for the interview");
        setLoading(false);
        return;
      }

      // Create interview data
      const interviewData = {
        candidateId: candidate?._id,
        candidateName: candidate?.fullName,
        candidateEmail: candidate?.email,
        jobId: job?._id,
        jobTitle: job?.title,
        companyName: job?.company?.name,
        scheduledDate: scheduledDateTime.toISOString(),
        duration: parseInt(formData.duration) || 60,
        type: formData.type || 'video',
        location: formData.location || '',
        meetingLink: formData.meetingLink || '',
        interviewer: formData.interviewer || '',
        notes: formData.notes || '',
        reminder: parseInt(formData.reminder) || 24,
        status: 'scheduled_for_interview',
        createdAt: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send email notification (simulated)
      await sendInterviewInvite(interviewData);
      
      // Create notification for the interview
      createInterviewNotification(interviewData);
      
      // Create status update notification
      if (job) {
        createStatusUpdateNotification({
          _id: job._id,
          candidateName: candidate?.fullName,
          jobTitle: job.title,
          companyName: job.company?.name
        }, 'scheduled_for_interview');
      }
      
      showSuccess("Interview scheduled successfully!");
      
      if (onSchedule) {
        onSchedule(interviewData);
      }
      
      onClose();
      
    } catch (error) {
      console.error("Error scheduling interview:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        formData: formData
      });
      
      if (error.message.includes('Invalid time value')) {
        showError("Invalid date or time selected. Please check your input and try again.");
      } else {
        showError("Failed to schedule interview. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const sendInterviewInvite = async (interviewData) => {
    // Simulate sending email invite
    const emailData = {
      to: interviewData.candidateEmail,
      subject: `Interview Invitation - ${interviewData.jobTitle} at ${interviewData.companyName}`,
      body: generateEmailBody(interviewData)
    };
    
    console.log("Sending interview invite:", emailData);
    
    // In a real app, this would call an email service
    return Promise.resolve();
  };

  const generateEmailBody = (data) => {
    const interviewDate = new Date(data.scheduledDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
Dear ${data.candidateName},

We are pleased to invite you for an interview for the position of ${data.jobTitle} at ${data.companyName}.

Interview Details:
- Date & Time: ${interviewDate}
- Duration: ${data.duration} minutes
- Type: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Interview
${data.location ? `- Location: ${data.location}` : ''}
${data.meetingLink ? `- Meeting Link: ${data.meetingLink}` : ''}
${data.interviewer ? `- Interviewer: ${data.interviewer}` : ''}

${data.notes ? `Additional Notes: ${data.notes}` : ''}

Please confirm your attendance by replying to this email.

Best regards,
The Hiring Team
    `.trim();
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[85vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Schedule Interview</h2>
                <p className="text-slate-300 text-sm">Set up a professional interview with the candidate</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl p-2 transition-all duration-300"
            >
              <X size={20} />
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6 gap-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= stepNum
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-slate-700 text-slate-400 border border-slate-600'
                }`}>
                  {step > stepNum ? <CheckCircle size={18} /> : stepNum}
                </div>
                <div className="text-center">
                  <div className={`text-sm font-medium transition-colors ${
                    step >= stepNum ? 'text-white' : 'text-slate-400'
                  }`}>
                    {stepNum === 1 ? 'Date & Time' : stepNum === 2 ? 'Interview Details' : 'Review & Confirm'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {stepNum === 1 ? 'Select when' : stepNum === 2 ? 'Choose format' : 'Final check'}
                  </div>
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                    step > stepNum ? 'bg-blue-500' : 'bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-slate-900/50 flex flex-col">
          {/* Candidate Info */}
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {candidate?.fullName?.charAt(0) || 'C'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <CheckCircle size={12} className="text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{candidate?.fullName}</h3>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    <Star size={12} className="mr-1" />
                    Shortlisted
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-blue-400" />
                    <span>{candidate?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-purple-400" />
                    <span>{job?.title} at {job?.company?.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Date & Time */}
          {step === 1 && (
            <div className="flex-1 flex flex-col p-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-2">When would you like to schedule?</h2>
                <p className="text-slate-300 text-sm">Choose a date and time that works for both you and the candidate</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="date" className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Calendar size={16} className="text-blue-400" />
                    </div>
                    Interview Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={getMinDate()}
                    className={`h-12 text-sm border border-slate-600 rounded-xl transition-all duration-300 bg-slate-800/50 text-white placeholder-slate-400 ${
                      errors.date 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' 
                        : 'focus:border-blue-400 focus:ring-blue-400/20 hover:border-slate-500'
                    }`}
                  />
                  {errors.date && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.date}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="time" className="text-sm font-bold text-gray-300 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Clock size={16} className="text-green-400" />
                    </div>
                    Interview Time *
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className={`h-10 text-sm border border-white/20 rounded-lg transition-all duration-300 bg-gray-800/50 text-white ${
                      errors.time 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'focus:border-green-400 hover:border-green-300'
                    }`}
                  />
                  {errors.time && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.time}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="duration" className="text-sm font-bold text-gray-300 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-purple-400" />
                  </div>
                  Duration *
                </Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                  <SelectTrigger className={`h-10 text-sm border border-white/20 rounded-lg transition-all duration-300 bg-gray-800/50 text-white ${
                    errors.duration 
                      ? 'border-red-400 focus:border-red-400' 
                      : 'focus:border-purple-400 hover:border-purple-300'
                  }`}>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border border-white/20 bg-gray-800/90 backdrop-blur-sm">
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value} className="text-sm py-3 hover:bg-purple-500/20 text-white">
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.duration && (
                  <div className="flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle size={14} />
                    <span>{errors.duration}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Interview Details */}
          {step === 2 && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2">What type of interview?</h2>
                <p className="text-gray-300 text-sm">Choose the format that works best for this interview</p>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                <Label className="text-sm font-bold text-gray-300 mb-4 block flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Users size={16} className="text-indigo-400" />
                  </div>
                  Interview Type *
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {interviewTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleInputChange('type', type.value)}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 group relative ${
                          isSelected
                            ? `border-${type.color}-400 bg-${type.color}-500/20 text-white shadow-lg`
                            : 'border-white/20 hover:border-white/30 text-gray-300 hover:shadow-lg bg-gray-800/30'
                        }`}
                      >
                        {type.popular && (
                          <div className="absolute -top-2 -right-2">
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg text-xs">
                              <Star size={10} className="mr-1" />
                              Popular
                            </Badge>
                          </div>
                        )}
                        <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? `bg-${type.color}-500/30` 
                            : 'bg-white/10 group-hover:bg-white/20'
                        }`}>
                          <Icon size={20} className={`transition-all duration-300 ${
                            isSelected 
                              ? `text-${type.color}-400` 
                              : 'text-gray-400 group-hover:text-gray-300'
                          }`} />
                        </div>
                        <div className="text-base font-bold mb-1">{type.label}</div>
                        <div className="text-xs text-gray-400">{type.description}</div>
                      </button>
                    );
                  })}
                </div>
                {errors.type && (
                  <div className="flex items-center gap-2 text-red-400 text-xs mt-4">
                    <AlertCircle size={14} />
                    <span>{errors.type}</span>
                  </div>
                )}
              </div>

              {formData.type === 'video' && (
                <div className="space-y-3 p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <Label htmlFor="meetingLink" className="text-sm font-bold text-gray-300 flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Video size={16} className="text-blue-400" />
                    </div>
                    Meeting Link *
                  </Label>
                  <Input
                    id="meetingLink"
                    type="url"
                    placeholder="https://meet.google.com/abc-defg-hij or https://zoom.us/j/123456789"
                    value={formData.meetingLink}
                    onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                    className={`h-10 text-sm border border-white/20 rounded-lg transition-all duration-300 bg-gray-800/50 text-white ${
                      errors.meetingLink 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'focus:border-blue-400 hover:border-blue-300'
                    }`}
                  />
                  {errors.meetingLink && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.meetingLink}</span>
                    </div>
                  )}
                  <p className="text-xs text-blue-400 flex items-center gap-2">
                    <Globe size={14} />
                    Supports Zoom, Google Meet, Teams, and other video platforms
                  </p>
                </div>
              )}

              {formData.type === 'in-person' && (
                <div className="space-y-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <Label htmlFor="location" className="text-sm font-bold text-gray-300 flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <MapPin size={16} className="text-red-400" />
                    </div>
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., 123 Main St, Suite 100, City, State 12345"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`h-10 text-sm border border-white/20 rounded-lg transition-all duration-300 bg-gray-800/50 text-white ${
                      errors.location 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'focus:border-red-400 hover:border-red-300'
                    }`}
                  />
                  {errors.location && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.location}</span>
                    </div>
                  )}
                  <p className="text-xs text-red-400 flex items-center gap-2">
                    <MapPin size={14} />
                    Include full address and any specific meeting room details
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="interviewer" className="text-sm font-bold text-gray-300 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <User size={16} className="text-purple-400" />
                    </div>
                    Interviewer Name
                  </Label>
                  <Input
                    id="interviewer"
                    placeholder="e.g., John Smith, Sarah Johnson"
                    value={formData.interviewer}
                    onChange={(e) => handleInputChange('interviewer', e.target.value)}
                    className={`h-10 text-sm border border-white/20 rounded-lg transition-all duration-300 bg-gray-800/50 text-white ${
                      errors.interviewer 
                        ? 'border-red-400 focus:border-red-400' 
                        : 'focus:border-purple-400 hover:border-purple-300'
                    }`}
                  />
                  {errors.interviewer && (
                    <div className="flex items-center gap-2 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      <span>{errors.interviewer}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="reminder" className="text-sm font-bold text-gray-300 flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Clock size={16} className="text-green-400" />
                    </div>
                    Send Reminder
                  </Label>
                  <Select value={formData.reminder} onValueChange={(value) => handleInputChange('reminder', value)}>
                    <SelectTrigger className="h-10 text-sm border border-white/20 focus:border-green-400 rounded-lg bg-gray-800/50 text-white">
                      <SelectValue placeholder="Select reminder time" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg border border-white/20 bg-gray-800/90 backdrop-blur-sm">
                      {reminders.map((reminder) => (
                        <SelectItem key={reminder.value} value={reminder.value} className="text-sm py-3 hover:bg-green-500/20 text-white">
                          {reminder.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review & Notes */}
          {step === 3 && (
            <div className="flex-1 flex flex-col">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-white mb-2">Review & Confirm</h2>
                <p className="text-gray-300 text-sm">Please review the details before sending the invitation</p>
              </div>
              
              <div className="p-6 bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 rounded-2xl border border-white/20 shadow-lg flex-1 overflow-hidden">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <CheckCircle size={20} className="text-green-400" />
                  </div>
                  Interview Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1">
                  <div className="space-y-3">
                    <div className="flex items-start gap-4 p-4 bg-gray-800/50 border border-white/20 rounded-2xl shadow-sm">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <Calendar size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300 font-medium mb-1">Date & Time</p>
                        <p className="text-lg font-bold text-white">
                          {new Date(`${formData.date}T${formData.time}`).toLocaleDateString('en-US', {
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
                    
                    <div className="flex items-start gap-4 p-4 bg-gray-800/50 border border-white/20 rounded-2xl shadow-sm">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Clock size={24} className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-300 font-medium mb-1">Duration</p>
                        <p className="text-lg font-bold text-white">{formData.duration} minutes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-gray-800/50 border border-white/20 rounded-2xl shadow-sm">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                        {formData.type === 'video' && <Video size={24} className="text-blue-400" />}
                        {formData.type === 'phone' && <Phone size={24} className="text-green-400" />}
                        {formData.type === 'in-person' && <MapPin size={24} className="text-red-400" />}
                        {formData.type === 'panel' && <Users size={24} className="text-purple-400" />}
                      </div>
                      <div>
                        <p className="text-sm text-gray-300 font-medium mb-1">Type</p>
                        <p className="text-lg font-bold text-white capitalize">{formData.type} Interview</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.location && (
                      <div className="flex items-start gap-4 p-4 bg-gray-800/50 border border-white/20 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                          <MapPin size={24} className="text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-300 font-medium mb-1">Location</p>
                          <p className="text-lg font-bold text-white">{formData.location}</p>
                        </div>
                      </div>
                    )}
                    
                    {formData.meetingLink && (
                      <div className="flex items-start gap-4 p-4 bg-gray-800/50 border border-white/20 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <Video size={24} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-300 font-medium mb-1">Meeting Link</p>
                          <a href={formData.meetingLink} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-blue-400 hover:text-blue-300 underline transition-colors">
                            Join Meeting
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {formData.interviewer && (
                      <div className="flex items-start gap-4 p-4 bg-gray-800/50 border border-white/20 rounded-2xl shadow-sm">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <User size={24} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-300 font-medium mb-1">Interviewer</p>
                          <p className="text-lg font-bold text-white">{formData.interviewer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="notes" className="text-lg font-bold text-gray-800 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <FileText size={20} className="text-gray-600" />
                  </div>
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information for the candidate (e.g., what to bring, preparation tips, etc.)..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="border-2 border-gray-200 focus:border-gray-400 rounded-2xl text-lg p-4"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center p-6 border-t border-slate-700/50 bg-slate-800/30">
            <div>
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back
                </Button>
              )}
            </div>
            
            <div className="flex gap-6">
              <Button
                variant="outline"
                onClick={onClose}
                className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </Button>
              
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={isValidating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isValidating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Validating...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight size={20} className="ml-2" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleSchedule}
                  disabled={loading}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Scheduling Interview...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-3" />
                      Schedule Interview
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;
