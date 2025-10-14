import CreatedApplications from "@/components/created-applications";
import CreatedJobs from "@/components/created-jobs";
import { useAuth } from "../context/AuthContext";
import { useGetUser } from "@/api/apiUsers";
import { BarLoader } from "react-spinners";
import { Briefcase, User, Building2 } from "lucide-react";

const MyJobs = () => {
  const { user, isSignedIn } = useAuth();
  const databaseUser = useGetUser(user?.id);

  if (!isSignedIn) {
    return (
      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white mt-4 text-lg">Loading your job information...</p>
          </div>
        </div>
      </main>
    );
  }

  const isRecruiter = databaseUser?.role === "recruiter";

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter mb-6">
          {isRecruiter ? "My Posted Jobs" : "My Applications"}
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto">
          {isRecruiter 
            ? "Manage your job postings and review applications from candidates."
            : "Track your job applications and their current status."
          }
        </p>
        
        {/* Role Badge */}
        <div className="mt-6 flex justify-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            isRecruiter 
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
              : 'bg-green-500/20 text-green-300 border border-green-500/30'
          }`}>
            {isRecruiter ? (
              <>
                <Building2 size={16} />
                Recruiter
              </>
            ) : (
              <>
                <User size={16} />
                Candidate
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {isRecruiter ? (
          <CreatedJobs />
        ) : (
          <CreatedApplications />
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

export default MyJobs;
