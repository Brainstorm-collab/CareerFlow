import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, User, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-center">
          <CardContent className="p-12">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={40} className="text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Access Restricted</h1>
            <p className="text-gray-300 mb-6 text-lg">
              You are not authorized to access this page. Only recruiters can post jobs on this platform.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3 text-gray-400">
                <User size={20} />
                <span>Current Role: Candidate</span>
              </div>
              <div className="text-sm text-gray-500">
                If you believe this is an error, please contact support or complete your profile setup.
              </div>
            </div>
            
            <div className="flex gap-4 justify-center mt-8">
              <Link to="/jobs">
                <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">
                  Browse Jobs
                </Button>
              </Link>
              <Link to="/">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ArrowLeft size={16} className="mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Unauthorized;
