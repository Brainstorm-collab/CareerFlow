import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/context/ToastContext";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
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
  ArrowLeft,
  Linkedin,
  Github,
  ExternalLink,
  CheckCircle,
  XCircle,
  Heart,
  Share2
} from "lucide-react";

const CandidateProfile = () => {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  
  // State management
  const [isSaved, setIsSaved] = useState(false);

  // Fetch candidate data from Convex
  const candidate = useQuery(api.users.getCandidateById, { candidateId });
  const loading = candidate === undefined;

  const handleContactCandidate = () => {
    showSuccess(`Contacting ${candidate?.fullName}...`);
  };

  const handleSaveCandidate = () => {
    setIsSaved(!isSaved);
    showSuccess(isSaved ? "Removed from saved candidates" : "Saved to your candidates");
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${candidate?.fullName} - Candidate Profile`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess("Profile link copied to clipboard");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to continue</h2>
          <p className="text-gray-400">You need to be logged in to view candidate profiles.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  // Handle candidate not found
  if (!loading && !candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Candidate not found</h2>
          <p className="text-gray-400 mb-4">The candidate you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/candidates")}>
            Back to Candidates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate("/candidates")}
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Candidates
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                      {candidate.profileImageUrl ? (
                        <img 
                          src={candidate.profileImageUrl} 
                          alt={candidate.fullName}
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : (
                        <User size={48} className="text-white" />
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">{candidate.fullName}</h1>
                    <p className="text-gray-400 mb-1">{candidate.currentPosition}</p>
                    <p className="text-gray-500 text-sm">{candidate.currentCompany}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-blue-400" />
                      <span className="text-gray-300 text-sm">{candidate.email}</span>
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-green-400" />
                        <span className="text-gray-300 text-sm">{candidate.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-purple-400" />
                      <span className="text-gray-300 text-sm">{candidate.location}</span>
                    </div>
                  </div>

                  {/* Social Links */}
                  {(candidate.linkedinUrl || candidate.githubUrl || candidate.portfolioUrl) && (
                    <div className="flex gap-3 justify-center mb-6">
                      {candidate.linkedinUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          onClick={() => window.open(candidate.linkedinUrl, '_blank')}
                        >
                          <Linkedin size={16} />
                        </Button>
                      )}
                      {candidate.githubUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                          onClick={() => window.open(candidate.githubUrl, '_blank')}
                        >
                          <Github size={16} />
                        </Button>
                      )}
                      {candidate.portfolioUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                          onClick={() => window.open(candidate.portfolioUrl, '_blank')}
                        >
                          <ExternalLink size={16} />
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      onClick={handleContactCandidate}
                    >
                      <MessageSquare size={16} className="mr-2" />
                      Contact Candidate
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                        onClick={handleSaveCandidate}
                      >
                        <Heart size={16} className={`mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                        {isSaved ? 'Saved' : 'Save'}
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="border-gray-500/30 text-gray-400 hover:bg-gray-500/10"
                        onClick={handleShareProfile}
                      >
                        <Share2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Experience</span>
                    <span className="text-white font-semibold">{candidate.experienceYears} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Skills</span>
                    <span className="text-white font-semibold">{candidate.skills?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Availability</span>
                    <span className="text-green-400 font-semibold">
                      {candidate.availability ? 'Available' : 'Not specified'}
                    </span>
                  </div>
                  {candidate.expectedSalary && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Expected Salary</span>
                      <span className="text-white font-semibold">{candidate.expectedSalary}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {candidate.bio && (
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">{candidate.bio}</p>
                  </CardContent>
                </Card>
              )}

              {/* Skills */}
              {candidate.skills?.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Current Experience */}
              {(candidate.currentPosition || candidate.currentCompany) && (
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Current Position</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-l-2 border-blue-500/30 pl-4">
                      {candidate.currentPosition && (
                        <h4 className="text-white font-semibold">{candidate.currentPosition}</h4>
                      )}
                      {candidate.currentCompany && (
                        <p className="text-blue-400 text-sm">{candidate.currentCompany}</p>
                      )}
                      <p className="text-gray-400 text-sm">{candidate.experienceYears} years experience</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Education */}
              {candidate.education && (
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-l-2 border-green-500/30 pl-4">
                      <p className="text-gray-300">{candidate.education}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certifications */}
              {candidate.certificates?.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {candidate.certificates.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Award size={16} className="text-yellow-400" />
                          <span className="text-gray-300">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Projects */}
              {candidate.projects?.length > 0 && (
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardHeader>
                    <CardTitle className="text-white">Projects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {candidate.projects.map((project, index) => (
                      <div key={index} className="border border-gray-700/50 rounded-lg p-4">
                        <h4 className="text-white font-semibold mb-2">Project {index + 1}</h4>
                        <p className="text-gray-300 text-sm">{project}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
