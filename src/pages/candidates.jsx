import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetUsersByRole } from "@/api/apiUsers";
import { useToast } from "@/context/ToastContext";
import { 
  Users, 
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
  Eye,
  Star,
  Award,
  Briefcase,
  Globe,
  MessageSquare,
  Search,
  Filter,
  ArrowLeft
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Candidates = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  
  // Get all candidates
  const candidates = useGetUsersByRole("candidate");
  
  // Filter candidates based on search and filters
  const filteredCandidates = candidates?.filter(candidate => {
    const matchesSearch = !searchTerm || 
      candidate.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExperience = experienceFilter === "all" || 
      (experienceFilter === "0-1" && candidate.experienceYears <= 1) ||
      (experienceFilter === "2-5" && candidate.experienceYears >= 2 && candidate.experienceYears <= 5) ||
      (experienceFilter === "5+" && candidate.experienceYears > 5);
    
    const matchesLocation = locationFilter === "all" || 
      candidate.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesExperience && matchesLocation;
  });

  const handleViewProfile = (candidate) => {
    navigate(`/candidate/${candidate._id}`);
  };

  const handleContactCandidate = (candidate) => {
    // In a real app, this would open a contact form or messaging system
    showSuccess(`Contacting ${candidate.fullName}...`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center overflow-x-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Floating Blur Effects */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to continue</h2>
          <p className="text-gray-400">You need to be logged in to view candidates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Blur Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/my-jobs">
              <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                <ArrowLeft size={16} className="mr-2" />
                Back to My Jobs
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Candidates</h1>
                <p className="text-gray-400">Browse and discover talented candidates</p>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-600/20 to-blue-700/20 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users size={20} className="text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">{candidates?.length || 0}</p>
                    <p className="text-sm text-gray-400">Total Candidates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-600/20 to-green-700/20 border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award size={20} className="text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {candidates?.filter(c => c.experienceYears > 5).length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Senior Level</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-purple-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {new Set(candidates?.map(c => c.location).filter(Boolean)).size || 0}
                    </p>
                    <p className="text-sm text-gray-400">Locations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-600/20 to-orange-700/20 border-orange-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star size={20} className="text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {candidates?.filter(c => c.skills?.length > 5).length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Highly Skilled</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-gray-800/50 border-gray-700/50 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  <SelectItem value="0-1">0-1 Years</SelectItem>
                  <SelectItem value="2-5">2-5 Years</SelectItem>
                  <SelectItem value="5+">5+ Years</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Array.from(new Set(candidates?.map(c => c.location).filter(Boolean))).map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                onClick={() => {
                  setSearchTerm("");
                  setExperienceFilter("all");
                  setLocationFilter("all");
                }}
              >
                <Filter size={16} className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates?.map((candidate) => (
            <Card key={candidate._id} className="bg-gray-800/50 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    {candidate.profileImageUrl ? (
                      <img 
                        src={candidate.profileImageUrl} 
                        alt={candidate.fullName}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <User size={24} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{candidate.fullName}</h3>
                    <p className="text-gray-400 text-sm mb-2">{candidate.currentPosition || "Available for opportunities"}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin size={14} />
                      <span>{candidate.location || "Location not specified"}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={16} className="text-blue-400" />
                    <span className="text-sm text-gray-300">
                      {candidate.experienceYears} years experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={16} className="text-green-400" />
                    <span className="text-sm text-gray-300">
                      {candidate.currentCompany || "Available"}
                    </span>
                  </div>
                  {candidate.expectedSalary && (
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} className="text-yellow-400" />
                      <span className="text-sm text-gray-300">
                        Expected: {candidate.expectedSalary}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills?.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills?.length > 3 && (
                      <Badge variant="secondary" className="bg-gray-500/20 text-gray-300 border-gray-500/30">
                        +{candidate.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                    onClick={() => handleViewProfile(candidate)}
                  >
                    <Eye size={14} className="mr-1" />
                    View Profile
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    onClick={() => handleContactCandidate(candidate)}
                  >
                    <MessageSquare size={14} className="mr-1" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCandidates?.length === 0 && (
          <Card className="bg-gray-800/50 border-gray-700/50">
            <CardContent className="p-12 text-center">
              <Users size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No candidates found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>

      </div>
    </div>
  );
};

export default Candidates;
