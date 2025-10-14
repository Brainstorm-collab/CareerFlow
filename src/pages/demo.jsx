import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "../context/AuthContext";
import { 
  getStorageStats, 
  clearAllData, 
  getSavedJobs, 
  getPostedJobs,
  getUserApplications,
  submitApplication
} from "@/utils/local-storage-service";
import { 
  Database, 
  Trash2, 
  Bookmark, 
  Briefcase, 
  FileText,
  Plus,
  Eye
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

const Demo = () => {
  const { user, isSignedIn } = useAuth();
  const [stats, setStats] = useState({});
  const [savedJobs, setSavedJobs] = useState([]);
  const [postedJobs, setPostedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  const refreshData = () => {
    if (!user) return;
    
    const currentStats = getStorageStats();
    setStats(currentStats);
    
    const userSavedJobs = getSavedJobs(user.id);
    setSavedJobs(userSavedJobs);
    
    const userPostedJobs = getPostedJobs(user.id);
    setPostedJobs(userPostedJobs);
    
    const userApplications = getUserApplications(user.id);
    setApplications(userApplications);
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all local storage data? This cannot be undone.')) {
      clearAllData();
      refreshData();
    }
  };

  const handleTestApplication = () => {
    if (!user) return;
    
    const testApplication = {
      job_id: 'test_job_123',
      cover_letter: 'This is a test application to demonstrate the local storage functionality.',
      resume_url: '/test-resume.pdf'
    };
    
    const result = submitApplication(testApplication, user.id);
    if (result.success) {
      showSuccess('Test application submitted successfully!');
      refreshData();
    } else {
      showError('Failed to submit test application: ' + result.message);
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white mt-4 text-lg">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter mb-6">
          Local Storage Demo
        </h1>
        <p className="text-gray-300 text-lg text-center max-w-2xl mx-auto mb-8">
          This page demonstrates how the CARRERFLOW app works with local storage instead of Supabase.
        </p>
      </section>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Storage Statistics */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Database size={24} className="text-blue-400" />
              Storage Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <div className="text-2xl font-bold text-blue-300">{stats.SAVED_JOBS || 0}</div>
                <div className="text-blue-200 text-sm">Saved Jobs</div>
              </div>
              <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                <div className="text-2xl font-bold text-green-300">{stats.POSTED_JOBS || 0}</div>
                <div className="text-green-200 text-sm">Posted Jobs</div>
              </div>
              <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <div className="text-2xl font-bold text-purple-300">{stats.APPLICATIONS || 0}</div>
                <div className="text-purple-200 text-sm">Applications</div>
              </div>
              <div className="text-center p-4 bg-orange-500/20 rounded-lg border border-orange-500/30">
                <div className="text-2xl font-bold text-orange-300">{stats.USER_DATA || 0}</div>
                <div className="text-orange-200 text-sm">User Records</div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-4 justify-center">
              <Button 
                onClick={refreshData}
                variant="outline" 
                className="border-white/20 hover:bg-white/10 text-white"
              >
                <Eye size={16} className="mr-2" />
                Refresh Data
              </Button>
              <Button 
                onClick={handleClearData}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 size={16} className="mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Saved Jobs */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Bookmark size={24} className="text-red-400" />
              Your Saved Jobs ({savedJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedJobs.length > 0 ? (
              <div className="space-y-3">
                {savedJobs.map((saved, index) => (
                  <div key={saved.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <div className="text-white font-medium">Job ID: {saved.job_id}</div>
                      <div className="text-gray-400 text-sm">Saved on: {new Date(saved.created_at).toLocaleDateString()}</div>
                    </div>
                    <Badge variant="outline" className="bg-red-500/20 border-red-500/30 text-red-300">
                      Saved
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Bookmark size={48} className="mx-auto mb-4 opacity-50" />
                <p>No saved jobs yet. Go to the jobs page and save some jobs!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posted Jobs */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase size={24} className="text-green-400" />
              Your Posted Jobs ({postedJobs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {postedJobs.length > 0 ? (
              <div className="space-y-3">
                {postedJobs.map((job, index) => (
                  <div key={job.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-white font-medium text-lg">{job.title}</div>
                      <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300">
                        Posted
                      </Badge>
                    </div>
                    <div className="text-gray-400 text-sm mb-2">
                      Company: {job.company?.name || 'N/A'} | Location: {job.location}
                    </div>
                    <div className="text-gray-300 text-sm line-clamp-2">{job.description}</div>
                    <div className="mt-3 flex gap-2">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                        {job.job_type}
                      </Badge>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                        {job.experience_level}
                      </Badge>
                      {job.remote_work && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                          Remote
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Briefcase size={48} className="mx-auto mb-4 opacity-50" />
                <p>No posted jobs yet. Go to the post job page and create your first job posting!</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} className="mr-2" />
                  Post a Job
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applications */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText size={24} className="text-purple-400" />
              Your Applications ({applications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length > 0 ? (
              <div className="space-y-3">
                {applications.map((app, index) => (
                  <div key={app.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-white font-medium">Job ID: {app.job_id}</div>
                      <Badge 
                        variant="outline" 
                        className={`${
                          app.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' :
                          app.status === 'accepted' ? 'bg-green-500/20 border-green-500/30 text-green-300' :
                          'bg-red-500/20 border-red-500/30 text-red-300'
                        }`}
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <div className="text-gray-400 text-sm mb-2">
                      Applied on: {new Date(app.created_at).toLocaleDateString()}
                    </div>
                    {app.cover_letter && (
                      <div className="text-gray-300 text-sm line-clamp-2">
                        Cover Letter: {app.cover_letter}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No applications yet. Apply to some jobs to see them here!</p>
                <Button 
                  onClick={handleTestApplication}
                  className="mt-4 bg-purple-600 hover:bg-purple-700"
                >
                  <Plus size={16} className="mr-2" />
                  Submit Test Application
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">
              How to Test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">For Candidates:</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Go to <strong>/jobs</strong> to browse available jobs</li>
                  <li>• Click the heart icon to save jobs</li>
                  <li>• View your saved jobs at <strong>/saved-jobs</strong></li>
                  <li>• Apply to jobs to see applications here</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">For Recruiters:</h4>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• Go to <strong>/post-job</strong> to create job postings</li>
                  <li>• View your posted jobs at <strong>/my-jobs</strong></li>
                  <li>• All data is stored locally in your browser</li>
                  <li>• Refresh this page to see updated statistics</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                <strong>Note:</strong> This demo uses local storage, so all data is stored in your browser. 
                When you clear your browser data or switch devices, this information will be lost. 
                This is perfect for testing and development, but for production use, you'll want to set up Supabase.
              </p>
            </div>
          </CardContent>
        </Card>
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

export default Demo;
