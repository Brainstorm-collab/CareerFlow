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
  PenBox,
  CheckCircle,
  Star,
  TrendingUp,
  Target,
  Zap,
  Shield
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
// import { getSupabaseClient } from "@/utils/supabase"; // Removed - will use Convex
import { useNavigate } from "react-router-dom";
import { useSyncUser } from "@/api/apiUsers";

const Onboarding = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, updateUserRole } = useAuth();
  const syncUser = useSyncUser();
  const navigate = useNavigate();

  const roles = [
    {
      id: "candidate",
      title: "Job Seeker",
      description: "Find your dream career opportunity",
      icon: Target,
      color: "from-blue-500 via-blue-600 to-indigo-600",
      gradient: "bg-gradient-to-br from-blue-500/20 via-blue-600/20 to-indigo-600/20",
      features: [
        "Discover 10,000+ verified job opportunities",
        "AI-powered job matching & recommendations",
        "Real-time application tracking & updates",
        "Direct communication with top employers"
      ],
      stats: "Join 50,000+ successful hires",
      action: "Start Job Search",
      destination: "/jobs"
    },
    {
      id: "recruiter",
      title: "Employer",
      description: "Hire the best talent for your team",
      icon: Building2,
      color: "from-emerald-500 via-teal-600 to-cyan-600",
      gradient: "bg-gradient-to-br from-emerald-500/20 via-teal-600/20 to-cyan-600/20",
      features: [
        "Post unlimited job openings",
        "Advanced candidate screening tools",
        "Collaborative hiring workflows",
        "Analytics & performance insights"
      ],
      stats: "Trusted by 1,000+ companies",
      action: "Post Your First Job",
      destination: "/post-job"
    }
  ];

  const handleRoleSelect = async (role) => {
    setSelectedRole(role.id);
    setLoading(true);

    try {
      // Update user role using AuthContext
      updateUserRole(role.id);
      
      // Update user role in stored users list (for email/password users)
      const storedUsers = JSON.parse(localStorage.getItem('careerflow_users') || '[]');
      const userIndex = storedUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        storedUsers[userIndex].role = role.id;
        localStorage.setItem('careerflow_users', JSON.stringify(storedUsers));
      }

      // Sync the role to Convex database
      if (user) {
        console.log('Syncing user to Convex with role:', role.id);
        console.log('User data:', user);
        
        const syncData = {
          socialId: user.id,
          provider: user.provider,
          email: user.email,
          firstName: user.firstName || user.name?.split(' ')[0] || '',
          lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
          fullName: user.name,
          profileImageUrl: user.picture,
          role: role.id
        };
        
        console.log('Sync data:', syncData);
        
        const result = await syncUser(syncData);
        console.log('Sync result:', result);
        console.log('User role synced to Convex database:', role.id);
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
    <div className="min-h-screen relative overflow-y-auto">
      {/* Website Background */}
      <div className="grid-background"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-8 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-20 right-12 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-16 left-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>

      <main className="relative z-10 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-5 lg:px-6 py-4">
          <div className="max-w-4xl mx-auto w-full">
            {/* Hero Section */}
            <div className="text-center mb-8">
              {/* Logo */}
              <div className="flex items-center justify-center mb-6">
                <img 
                  src="/newlogo.png" 
                  alt="CareerFlow Logo" 
                  className="h-12 sm:h-14 w-auto"
                />
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                  CareerFlow
                </span>
              </h1>
              
              <p className="text-base text-slate-300 mb-3 max-w-xl mx-auto">
                Choose your path and unlock your potential
              </p>
              
              <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <Shield size={14} className="text-emerald-400" />
                  <span>Secure & Trusted</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap size={14} className="text-blue-400" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp size={14} className="text-purple-400" />
                  <span>Proven Results</span>
                </div>
              </div>
            </div>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {roles.map((role, index) => (
                <Card
                  key={role.id}
                  className={`group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02] ${
                    selectedRole === role.id 
                      ? 'ring-2 ring-blue-500/50 shadow-2xl shadow-blue-500/20' 
                      : 'hover:shadow-xl hover:shadow-slate-500/10'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  {/* Card Background Gradient */}
                  <div className={`absolute inset-0 ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <CardHeader className="relative z-10 text-center pb-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <role.icon size={24} className="text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-white mb-2">
                      {role.title}
                    </CardTitle>
                    
                    <p className="text-slate-300 text-sm mb-3">
                      {role.description}
                    </p>
                    
                    <Badge 
                      variant="outline" 
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium ${
                        role.id === 'candidate' 
                          ? 'border-blue-500/30 text-blue-300 bg-blue-500/10' 
                          : 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                      }`}
                    >
                      <Star size={12} />
                      {role.stats}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="relative z-10 space-y-4">
                    <div className="space-y-2">
                      {role.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-2 text-slate-300">
                          <CheckCircle 
                            size={14} 
                            className={`mt-0.5 flex-shrink-0 ${
                              role.id === 'candidate' ? 'text-blue-400' : 'text-emerald-400'
                            }`} 
                          />
                          <span className="text-xs leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="bg-slate-700/50" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <span>Click to select</span>
                      </div>
                      <ArrowRight 
                        size={16} 
                        className={`transition-all duration-300 ${
                          selectedRole === role.id 
                            ? 'translate-x-2 text-blue-400' 
                            : 'text-slate-500 group-hover:text-slate-300 group-hover:translate-x-1'
                        }`} 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Continue Button */}
            {selectedRole && (
              <div className="sticky bottom-0 left-0 right-0 z-20 text-center py-3 px-4 bg-slate-900/70 backdrop-blur">
                <Button
                  onClick={() => handleRoleSelect(roles.find(r => r.id === selectedRole))}
                  disabled={loading}
                  size="sm"
                  className={`px-6 py-3 text-sm font-semibold rounded-lg shadow-xl transition-all duration-300 hover:scale-105 ${
                    selectedRole === 'candidate' 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-blue-500/25' 
                      : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-emerald-500/25'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Setting up...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{roles.find(r => r.id === selectedRole)?.action}</span>
                      <ArrowRight size={18} />
                    </div>
                  )}
                </Button>
              </div>
            )}

            {/* Additional Info */}
            <div className="text-center">
              <p className="text-slate-400 text-xs mb-4">
                You can change your role anytime in your profile settings
              </p>
              
              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center">
              <p className="text-slate-400 text-xs">
                Made with ❤️ by G.Eesaan • Empowering careers worldwide
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
