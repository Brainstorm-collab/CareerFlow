import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, User, ArrowLeft, Briefcase, Users, Info } from "lucide-react";

const Unauthorized = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-600/20 flex items-center justify-center">
              <Lock size={24} className="text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Access Restricted</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            You don't have permission to access this feature
          </p>
        </div>

        {/* Main Content */}
        <Card className="bg-black/20 backdrop-blur-sm border border-white/10 text-center mb-8">
          <CardContent className="p-12">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Lock size={48} className="text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Post Job Access Restricted</h2>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Only recruiters can post jobs on CareerFlow. As a candidate, you can browse and apply to jobs, 
              but posting jobs requires a recruiter account.
            </p>

            {/* Role Information */}
            <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <User size={24} className="text-blue-400" />
                <span className="text-white font-semibold text-lg">Your Current Role: Candidate</span>
              </div>
              <p className="text-gray-400 text-sm">
                Candidates can search jobs, apply to positions, and manage their applications
              </p>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase size={20} className="text-blue-400" />
                  <h3 className="text-white font-semibold">For Candidates</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Browse jobs, apply to positions, save interesting jobs, and track your applications
                </p>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users size={20} className="text-green-400" />
                  <h3 className="text-white font-semibold">For Recruiters</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Post job openings, manage applications, and find qualified candidates for your company
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/jobs">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                  <Briefcase size={18} className="mr-2" />
                  Browse Available Jobs
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                  <ArrowLeft size={18} className="mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <Info size={20} className="text-yellow-400" />
                <span className="text-yellow-300 font-semibold">Need to Post Jobs?</span>
              </div>
              <p className="text-gray-300 text-sm">
                If you're a recruiter or employer, please contact support to upgrade your account or 
                create a recruiter profile to access job posting features.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Unauthorized;
