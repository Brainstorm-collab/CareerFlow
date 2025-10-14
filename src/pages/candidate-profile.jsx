import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft,
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Building2,
  GraduationCap,
  DollarSign,
  Clock,
  FileText,
  Download,
  Star,
  Award,
  Briefcase,
  Globe,
  MessageSquare,
  Share2,
  Bookmark,
  Linkedin,
  Github,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import InterviewScheduler from "@/components/interview-scheduler";

const CandidateProfile = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInterviewScheduler, setShowInterviewScheduler] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // In a real app, you would fetch candidate data by ID
    // For now, we'll simulate loading
    const fetchCandidate = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock candidate data - in real app, fetch from API
        const mockCandidate = {
          _id: candidateId,
          fullName: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          experienceYears: 5,
          currentPosition: "Senior Software Engineer",
          currentCompany: "Tech Corp",
          education: "Bachelor's in Computer Science, Stanford University",
          expectedSalary: "$120,000 - $150,000",
          noticePeriod: "2 weeks",
          availability: "Available immediately",
          skills: ["React", "Node.js", "Python", "AWS", "Docker", "Kubernetes", "TypeScript", "GraphQL"],
          bio: "Experienced software engineer with 5+ years of experience in full-stack development. Passionate about building scalable applications and leading technical teams.",
          linkedinUrl: "https://linkedin.com/in/johndoe",
          githubUrl: "https://github.com/johndoe",
          portfolioUrl: "https://johndoe.dev",
          resumeUrl: "/resumes/john-doe-resume.pdf"
        };
        
        setCandidate(mockCandidate);
      } catch (error) {
        console.error("Error fetching candidate:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [candidateId]);

  const handleInterviewScheduled = (interviewData) => {
    // Store interview data (in a real app, this would be saved to database)
    const existingInterviews = JSON.parse(localStorage.getItem('scheduledInterviews') || '[]');
    existingInterviews.push(interviewData);
    localStorage.setItem('scheduledInterviews', JSON.stringify(existingInterviews));
    
    showSuccess(`Interview scheduled for ${new Date(interviewData.scheduledDate).toLocaleDateString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading candidate profile...</div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Candidate not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">Candidate Profile</h1>
              <p className="text-gray-400">Complete professional profile and portfolio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                // Save profile functionality
                alert('Profile saved to favorites!');
              }}
            >
              <Bookmark size={16} className="mr-2" />
              Save Profile
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                // Share profile functionality
                if (navigator.share) {
                  navigator.share({
                    title: `${candidate.fullName} - Candidate Profile`,
                    text: `Check out ${candidate.fullName}'s profile on CareerFlow`,
                    url: window.location.href
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Profile link copied to clipboard!');
                }
              }}
            >
              <Share2 size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {candidate.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-white text-3xl font-bold mb-2">{candidate.fullName}</h2>
                      <p className="text-gray-400 text-xl mb-1">{candidate.currentPosition}</p>
                      <p className="text-gray-500 text-lg">{candidate.currentCompany}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin size={16} />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Calendar size={16} />
                          <span>{candidate.experienceYears} years experience</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        if (candidate.email) {
                          // Open Gmail compose with the candidate's email
                          const subject = `Hello ${candidate.fullName} - CareerFlow`;
                          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(candidate.email)}&su=${encodeURIComponent(subject)}`;
                          window.open(gmailUrl, '_blank');
                        } else {
                          alert('Email not available');
                        }
                      }}
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-white font-semibold mb-3">About</h3>
                  <p className="text-gray-300 leading-relaxed">{candidate.bio}</p>
                </div>

                {/* Social Links */}
                <div className="flex gap-4">
                  {candidate.linkedinUrl && (
                    <a
                      href={candidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Linkedin size={20} />
                      <span>LinkedIn</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {candidate.githubUrl && (
                    <a
                      href={candidate.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      <Github size={20} />
                      <span>GitHub</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {candidate.portfolioUrl && (
                    <a
                      href={candidate.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Globe size={20} />
                      <span>Portfolio</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Star size={20} />
                  Skills & Expertise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {candidate.skills.map((skill, index) => (
                    <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase size={20} />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-l-2 border-blue-500/30 pl-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-semibold text-lg">{candidate.currentPosition}</h4>
                      <p className="text-blue-400 font-medium">{candidate.currentCompany}</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Current
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">2020 - Present</p>
                  <p className="text-gray-300">
                    Leading development of scalable web applications using React, Node.js, and cloud technologies. 
                    Mentoring junior developers and collaborating with cross-functional teams to deliver high-quality software solutions.
                  </p>
                </div>
                
                <div className="border-l-2 border-gray-500/30 pl-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white font-semibold text-lg">Software Engineer</h4>
                      <p className="text-blue-400 font-medium">Previous Company</p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">2018 - 2020</p>
                  <p className="text-gray-300">
                    Developed and maintained web applications using modern JavaScript frameworks. 
                    Collaborated with design and product teams to implement user-friendly interfaces.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GraduationCap size={20} />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-l-2 border-purple-500/30 pl-6">
                  <h4 className="text-white font-semibold text-lg">Bachelor of Science in Computer Science</h4>
                  <p className="text-purple-400 font-medium">Stanford University</p>
                  <p className="text-gray-400 text-sm mb-3">2014 - 2018</p>
                  <p className="text-gray-300">
                    Graduated with honors. Focused on software engineering, algorithms, and data structures. 
                    Relevant coursework included web development, database systems, and machine learning.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User size={20} />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail size={18} className="text-blue-400" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone size={18} className="text-green-400" />
                  <span>{candidate.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin size={18} className="text-red-400" />
                  <span>{candidate.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock size={20} />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Available
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Notice Period:</span>
                  <span className="text-white">{candidate.noticePeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Expected Salary:</span>
                  <span className="text-white">{candidate.expectedSalary}</span>
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText size={20} />
                  Resume
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    if (candidate.resumeUrl) {
                      window.open(candidate.resumeUrl, '_blank');
                    } else {
                      alert('Resume not available');
                    }
                  }}
                >
                  <Eye size={16} className="mr-2" />
                  View Resume
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    if (candidate.resumeUrl) {
                      const link = document.createElement('a');
                      link.href = candidate.resumeUrl;
                      link.download = 'resume.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } else {
                      alert('Resume not available for download');
                    }
                  }}
                >
                  <Download size={16} className="mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare size={20} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    if (candidate.email) {
                      // Open Gmail compose with the candidate's email
                      const subject = `Regarding your profile - ${candidate.fullName}`;
                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(candidate.email)}&su=${encodeURIComponent(subject)}`;
                      window.open(gmailUrl, '_blank');
                    } else {
                      alert('Email not available');
                    }
                  }}
                >
                  <Mail size={16} className="mr-2" />
                  Send Message
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    if (candidate.phone) {
                      window.location.href = `tel:${candidate.phone}`;
                    } else {
                      alert('Phone number not available');
                    }
                  }}
                >
                  <Phone size={16} className="mr-2" />
                  Schedule Call
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={() => setShowInterviewScheduler(true)}
                >
                  <Calendar size={16} className="mr-2" />
                  Schedule Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Interview Scheduler Modal */}
      <InterviewScheduler
        isOpen={showInterviewScheduler}
        onClose={() => setShowInterviewScheduler(false)}
        candidate={candidate}
        job={null} // No specific job context in profile page
        onSchedule={handleInterviewScheduled}
      />
    </div>
  );
};

export default CandidateProfile;
