import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Users, 
  User,
  Mail,
  Building2,
  Trash2,
  Edit
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

const ScheduledInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    // Load scheduled interviews from localStorage
    const storedInterviews = JSON.parse(localStorage.getItem('scheduledInterviews') || '[]');
    setInterviews(storedInterviews);
    setLoading(false);
  }, []);

  const handleDeleteInterview = (interviewId) => {
    const updatedInterviews = interviews.filter(interview => interview.candidateId !== interviewId);
    setInterviews(updatedInterviews);
    localStorage.setItem('scheduledInterviews', JSON.stringify(updatedInterviews));
    showSuccess("Interview deleted successfully");
  };

  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return Video;
      case 'phone':
        return Phone;
      case 'in-person':
        return MapPin;
      case 'panel':
        return Users;
      default:
        return Calendar;
    }
  };

  const getStatusColor = (interviewDate) => {
    const now = new Date();
    const interview = new Date(interviewDate);
    const diffTime = interview - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    if (diffDays === 0) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (diffDays <= 1) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border-green-500/30';
  };

  const getStatusText = (interviewDate) => {
    const now = new Date();
    const interview = new Date(interviewDate);
    const diffTime = interview - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Completed';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days away`;
  };

  if (loading) {
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
        <div className="relative z-10 text-white text-xl">Loading interviews...</div>
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Scheduled Interviews</h1>
          <p className="text-gray-300">Manage and view all scheduled interviews</p>
        </div>

        {interviews.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-12 text-center">
              <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Interviews Scheduled</h3>
              <p className="text-gray-400">Start scheduling interviews with candidates to see them here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview, index) => {
              const TypeIcon = getInterviewTypeIcon(interview.type);
              const interviewDate = new Date(interview.scheduledDate);
              
              return (
                <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <TypeIcon size={20} className="text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{interview.candidateName}</CardTitle>
                          <p className="text-gray-400 text-sm">{interview.jobTitle}</p>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(interview.scheduledDate)} border px-3 py-1 text-xs`}>
                        {getStatusText(interview.scheduledDate)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar size={16} className="text-blue-400" />
                        <span className="text-sm">
                          {interviewDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-300">
                        <Clock size={16} className="text-green-400" />
                        <span className="text-sm">
                          {interviewDate.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} ({interview.duration} min)
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-300">
                        <Mail size={16} className="text-purple-400" />
                        <span className="text-sm">{interview.candidateEmail}</span>
                      </div>
                      
                      {interview.location && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <MapPin size={16} className="text-red-400" />
                          <span className="text-sm">{interview.location}</span>
                        </div>
                      )}
                      
                      {interview.meetingLink && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <Video size={16} className="text-blue-400" />
                          <a 
                            href={interview.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-400 hover:text-blue-300 underline"
                          >
                            Join Meeting
                          </a>
                        </div>
                      )}
                      
                      {interview.interviewer && (
                        <div className="flex items-center gap-3 text-gray-300">
                          <User size={16} className="text-yellow-400" />
                          <span className="text-sm">Interviewer: {interview.interviewer}</span>
                        </div>
                      )}
                    </div>
                    
                    {interview.notes && (
                      <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-gray-300 text-sm">{interview.notes}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          // Edit functionality would go here
                          showSuccess("Edit functionality coming soon!");
                        }}
                      >
                        <Edit size={14} className="mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        onClick={() => handleDeleteInterview(interview.candidateId)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduledInterviews;
