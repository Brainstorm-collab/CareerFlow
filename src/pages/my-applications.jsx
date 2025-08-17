import JobCard from "@/components/job-card";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { FileText, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useJobContext } from "@/context/JobContext";

const MyApplications = () => {
  const { isLoaded, user } = useUser();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getAppliedJobsData } = useJobContext();

  // Fetch applied jobs from context
  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !user) return;
      
      setLoading(true);
      try {
        // Get applied jobs from context
        const appliedJobsData = getAppliedJobsData();
        setAppliedJobs(appliedJobsData);
      } catch (error) {
        console.error('Error fetching applied jobs:', error);
        setAppliedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, user, getAppliedJobsData]);

  const handleJobAction = () => {
    // Refresh applied jobs when needed
    if (user) {
      const appliedJobsData = getAppliedJobsData();
      setAppliedJobs(appliedJobsData);
    }
  };

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white mt-4 text-lg">Loading your applications...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={40} className="text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
              <p className="text-gray-300 mb-6 text-lg">
                Please sign in to view your job applications.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tighter mb-4">
            My Applications
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Track all the jobs you've applied to and their current status
          </p>
        </div>

        {/* Applications Count */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-blue-500/20 border border-blue-500/30 rounded-full px-6 py-3">
            <CheckCircle size={20} className="text-blue-400" />
            <span className="text-blue-300 font-medium">
              {appliedJobs.length} Application{appliedJobs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Applications List */}
        {appliedJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={48} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
            <p className="text-gray-400 mb-6">
              Start applying to jobs and track your applications here!
            </p>
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              Browse Jobs
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {appliedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                savedInit={false}
                onJobAction={handleJobAction}
              />
            ))}
          </div>
        )}
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

export default MyApplications;
