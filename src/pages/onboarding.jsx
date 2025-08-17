import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Building2, 
  Briefcase, 
  Search, 
  Plus, 
  ArrowRight,
  Sparkles,
  Users,
  PenBox
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { getSupabaseClient } from "@/utils/supabase";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const roles = [
    {
      id: "candidate",
      title: "Candidate",
      description: "I'm looking for my next career opportunity",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Browse thousands of job listings",
        "Save interesting positions",
        "Track your applications",
        "Get personalized job recommendations"
      ],
      action: "Find Jobs",
      destination: "/jobs"
    },
    {
      id: "recruiter",
      title: "Recruiter",
      description: "I want to hire talented professionals",
      icon: PenBox,
      color: "from-red-500 to-pink-500",
      features: [
        "Post job openings",
        "Manage applications",
        "Find qualified candidates",
        "Track hiring metrics"
      ],
      action: "Post Jobs",
      destination: "/post-job"
    }
  ];

  const handleRoleSelect = async (role) => {
    setSelectedRole(role.id);
    setLoading(true);

    try {
      // Update user role in Supabase
      const supabase = getSupabaseClient();
      const { error: supabaseError } = await supabase
        .from('users')
        .upsert({
          clerk_id: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          first_name: user.firstName,
          last_name: user.lastName,
          role: role.id,
          updated_at: new Date().toISOString()
        });

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
      }

      // Update user role in Clerk metadata
      try {
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            role: role.id
          }
        });
        console.log('Role updated in Clerk metadata:', role.id);
      } catch (clerkError) {
        console.error('Clerk metadata update error:', clerkError);
      }

      // Redirect to appropriate page
      navigate(role.destination);
    } catch (error) {
      console.error('Error updating user role:', error);
      // Still redirect even if there's an error
      navigate(role.destination);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles size={40} className="text-white" />
          </div>
          <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter mb-6">
            I am a...
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Choose your role to get started with CARRERFLOW
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`bg-black/20 backdrop-blur-sm border-white/10 hover:bg-black/30 transition-all duration-300 cursor-pointer group ${
                selectedRole === role.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <role.icon size={32} className="text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {role.title}
                </CardTitle>
                <p className="text-gray-300 text-sm">
                  {role.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-gray-300 text-sm">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Separator className="bg-white/10" />
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-white/5 border-white/20 text-white/70">
                    {role.id === 'candidate' ? 'Job Seeker' : 'Recruiter'}
                  </Badge>
                  <ArrowRight 
                    size={20} 
                    className={`text-gray-400 transition-transform duration-300 ${
                      selectedRole === role.id ? 'translate-x-1 text-blue-400' : ''
                    }`} 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        {selectedRole && (
          <div className="text-center">
            <Button
              onClick={() => handleRoleSelect(roles.find(r => r.id === selectedRole))}
              disabled={loading}
              size="lg"
              className={`px-8 py-4 text-lg ${
                selectedRole === 'candidate' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Setting up...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Continue as {roles.find(r => r.id === selectedRole)?.title}
                  <ArrowRight size={20} />
                </div>
              )}
            </Button>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 text-sm">
            You can change your role later in your profile settings
          </p>
        </div>
        
        {/* Footer Attribution */}
        <div className="text-center py-8 mt-16">
          <p className="text-gray-400 text-sm">
            Made with 💗 by G.Eesaan
          </p>
        </div>
      </div>
    </main>
  );
};

export default Onboarding;
