import { useUser } from "@clerk/clerk-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Building2, PenBox, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RoleDebug = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-center max-w-md">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Not Signed In</h1>
            <p className="text-gray-300 mb-6">
              Please sign in to view your role information.
            </p>
            <Link to="/?sign-in=true">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userRole = user?.unsafeMetadata?.role;
  const hasRole = !!userRole;

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Role Debug Information</h1>
          <p className="text-gray-300">
            This page shows your current authentication and role status
          </p>
        </div>

        {/* User Information */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <User size={20} className="text-blue-400" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-400">User ID</label>
                <p className="text-white font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Email</label>
                <p className="text-white">{user.primaryEmailAddress?.emailAddress || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">First Name</label>
                <p className="text-white">{user.firstName || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-400">Last Name</label>
                <p className="text-white">{user.lastName || 'Not set'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Information */}
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 size={20} className="text-green-400" />
              Role Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-sm font-medium text-gray-400">Current Role</label>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant={hasRole ? "default" : "destructive"}
                    className={hasRole ? "bg-green-600" : "bg-red-600"}
                  >
                    {userRole || 'Not Set'}
                  </Badge>
                  {hasRole && (
                    <span className="text-green-400 text-sm">✓ Role is set</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-400">Unsafe Metadata</label>
              <div className="mt-1 p-3 bg-gray-800/50 rounded-lg">
                <pre className="text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(user.unsafeMetadata, null, 2) || 'No metadata'}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {!hasRole && (
            <div className="mb-6">
              <Card className="bg-yellow-500/10 backdrop-blur-sm border-yellow-500/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                    Role Not Set
                  </h3>
                  <p className="text-gray-300 mb-4">
                    You need to complete your profile setup to access platform features.
                  </p>
                  <Link to="/onboarding">
                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                      Complete Profile Setup
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {userRole === 'recruiter' && (
            <div className="mb-6">
              <Card className="bg-green-500/10 backdrop-blur-sm border-green-500/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-2 flex items-center gap-2">
                    <PenBox size={20} />
                    Recruiter Access Granted
                  </h3>
                  <p className="text-gray-300 mb-4">
                    You can now post jobs and manage your job listings.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/post-job">
                      <Button className="bg-green-600 hover:bg-green-700">
                        Post a Job
                      </Button>
                    </Link>
                    <Link to="/my-jobs">
                      <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
                        My Jobs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {userRole === 'candidate' && (
            <div className="mb-6">
              <Card className="bg-blue-500/10 backdrop-blur-sm border-blue-500/20">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <Users size={20} />
                    Candidate Access Granted
                  </h3>
                  <p className="text-gray-300 mb-4">
                    You can browse jobs, save favorites, and apply for positions.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/jobs">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Browse Jobs
                      </Button>
                    </Link>
                    <Link to="/saved-jobs">
                      <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                        Saved Jobs
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                Go Home
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                Change Role
              </Button>
            </Link>
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

export default RoleDebug;
