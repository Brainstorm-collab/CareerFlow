import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building2, 
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Star
} from "lucide-react";

const JobApplicants = () => {
  const { jobId } = useParams();
  const { user } = useUser();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Mock data for demonstration - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJob({
        id: jobId,
        title: "Senior Frontend Developer",
        company: "TechCorp",
        location: "Remote",
        status: "open",
        applications_count: 12,
        posted_date: "2024-01-15"
      });

      setApplicants([
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@email.com",
          phone: "+1-555-0123",
          applied_date: "2024-01-20",
          status: "pending",
          experience: "5 years",
          location: "New York, NY",
          skills: ["React", "TypeScript", "Node.js", "AWS"],
          resume_url: "#",
          cover_letter: "I'm excited about this opportunity and believe my experience with modern frontend technologies makes me a great fit for your team.",
          rating: 4.5
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@email.com",
          phone: "+1-555-0124",
          applied_date: "2024-01-19",
          status: "shortlisted",
          experience: "7 years",
          location: "San Francisco, CA",
          skills: ["Vue.js", "JavaScript", "CSS3", "Git"],
          resume_url: "#",
          cover_letter: "With over 7 years of experience in frontend development, I've successfully delivered multiple large-scale applications.",
          rating: 4.8
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike.johnson@email.com",
          phone: "+1-555-0125",
          applied_date: "2024-01-18",
          status: "rejected",
          experience: "3 years",
          location: "Austin, TX",
          skills: ["Angular", "JavaScript", "HTML5"],
          resume_url: "#",
          cover_letter: "I'm a passionate developer looking to grow my skills in a dynamic environment.",
          rating: 3.9
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [jobId]);

  const updateApplicantStatus = (applicantId, newStatus) => {
    setApplicants(prev => 
      prev.map(app => 
        app.id === applicantId 
          ? { ...app, status: newStatus }
          : app
      )
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shortlisted': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'shortlisted': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-center max-w-md">
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
            <p className="text-gray-300 mb-6">
              The job you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Link to="/my-jobs">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Back to My Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Job Applicants</h1>
              <p className="text-gray-300">
                Manage applications for: <span className="text-blue-400 font-semibold">{job.title}</span>
              </p>
            </div>
            <Link to="/my-jobs">
              <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                ← Back to My Jobs
              </Button>
            </Link>
          </div>
          
          {/* Job Summary */}
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <Building2 size={20} className="text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Company</p>
                    <p className="text-white font-semibold">{job.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white font-semibold">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Applications</p>
                    <p className="text-white font-semibold">{job.applications_count}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Posted</p>
                    <p className="text-white font-semibold">{job.posted_date}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applicants List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applicants List */}
          <div className="lg:col-span-2">
            <Card className="bg-black/20 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  <Users size={20} className="text-blue-400" />
                  Applicants ({applicants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {applicants.map((applicant) => (
                  <div
                    key={applicant.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                      selectedApplicant?.id === applicant.id 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-white/10'
                    }`}
                    onClick={() => setSelectedApplicant(applicant)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {applicant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{applicant.name}</h3>
                          <p className="text-gray-400 text-sm">{applicant.experience} experience</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star size={14} fill="currentColor" />
                          <span className="text-xs">{applicant.rating}</span>
                        </div>
                        <Badge className={getStatusColor(applicant.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(applicant.status)}
                            {applicant.status}
                          </div>
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Mail size={14} />
                        <span className="truncate">{applicant.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <MapPin size={14} />
                        <span className="truncate">{applicant.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {applicant.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-white/20 text-white/70">
                          {skill}
                        </Badge>
                      ))}
                      {applicant.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs border-white/20 text-white/70">
                          +{applicant.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        Applied {applicant.applied_date}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 hover:bg-white/10 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateApplicantStatus(applicant.id, 'shortlisted');
                          }}
                        >
                          Shortlist
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 hover:bg-white/10 text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateApplicantStatus(applicant.id, 'rejected');
                          }}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Applicant Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedApplicant ? (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <User size={18} className="text-green-400" />
                    Applicant Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl mx-auto mb-3">
                      {selectedApplicant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-white font-semibold text-lg">{selectedApplicant.name}</h3>
                    <p className="text-gray-400">{selectedApplicant.experience} experience</p>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={16} className="text-blue-400" />
                      <span className="text-white text-sm">{selectedApplicant.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={16} className="text-green-400" />
                      <span className="text-white text-sm">{selectedApplicant.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="text-purple-400" />
                      <span className="text-white text-sm">{selectedApplicant.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-yellow-400" />
                      <span className="text-white text-sm">Applied {selectedApplicant.applied_date}</span>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div>
                    <h4 className="text-white font-semibold mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedApplicant.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-white/20 text-white/70">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  <div>
                    <h4 className="text-white font-semibold mb-2">Cover Letter</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedApplicant.cover_letter}
                    </p>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <Eye size={16} className="mr-2" />
                      View Resume
                    </Button>
                    <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white">
                      <Download size={16} className="mr-2" />
                      Download Resume
                    </Button>
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => updateApplicantStatus(selectedApplicant.id, 'shortlisted')}
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Shortlist Candidate
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                      onClick={() => updateApplicantStatus(selectedApplicant.id, 'rejected')}
                    >
                      <XCircle size={16} className="mr-2" />
                      Reject Candidate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                <CardContent className="p-8 text-center">
                  <Users size={48} className="text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Select an Applicant</h3>
                  <p className="text-gray-400 text-sm">
                    Click on any applicant from the list to view their detailed profile and manage their application.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Attribution */}
      <div className="text-center py-8 mt-16">
        <p className="text-gray-400 text-sm">
          Made with 💗 by G.Eesaan
        </p>
      </div>
    </main>
  );
};

export default JobApplicants;
