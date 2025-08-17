import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Award, Globe, Star, Zap, Shield, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Hero Section */}
      <section className="text-center mb-12 sm:mb-16 px-4 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-24 h-24 bg-green-500/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Logo with Enhanced Styling */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/20 group-hover:border-white/30 transition-all duration-300">
              <img 
                src="/newlogo.png" 
                alt="CareerFlow Logo" 
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
        
        <h1 className="gradient-title font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight mb-6 sm:mb-8">
          About CARRERFLOW
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl lg:text-2xl max-w-3xl lg:max-w-4xl mx-auto leading-relaxed font-medium">
          Connecting talented professionals with amazing opportunities worldwide. 
          We're building the future of job searching and recruitment.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto mb-12 sm:mb-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          <Card className="bg-black/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300 group hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-300">
                  <Target size={28} className="text-blue-400" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed text-base">
                To democratize access to career opportunities by providing a seamless, 
                transparent platform where talent meets opportunity. We believe everyone 
                deserves to find work that fulfills them and advances their career.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-300 group hover:scale-105">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-300">
                  <Globe size={28} className="text-green-400" />
                </div>
                <CardTitle className="text-xl font-bold text-white">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed text-base">
                To become the world's most trusted platform for career development, 
                where companies find exceptional talent and professionals discover 
                opportunities that align with their aspirations and values.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What We Do */}
      <section className="max-w-6xl mx-auto mb-12 sm:mb-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What We Do
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Empowering both job seekers and employers with innovative solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          <Card className="bg-black/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300 group hover:scale-105 text-center">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users size={36} className="text-blue-400" />
              </div>
              <CardTitle className="text-xl font-bold text-white mb-2">For Job Seekers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                Discover thousands of job opportunities, save interesting positions, 
                and apply with ease. Track your applications and manage your career growth.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border border-white/10 hover:border-green-500/30 transition-all duration-300 group hover:scale-105 text-center">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award size={36} className="text-green-400" />
              </div>
              <CardTitle className="text-xl font-bold text-white mb-2">For Employers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                Post and manage job openings, reach qualified candidates, and handle applications 
                efficiently. Find the perfect fit for your team and company culture.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-sm border border-white/10 hover:border-purple-500/30 transition-all duration-300 group hover:scale-105 text-center">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Globe size={36} className="text-purple-400" />
              </div>
              <CardTitle className="text-xl font-bold text-white mb-2">Global Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                Connect with opportunities and talent worldwide. Our platform breaks 
                down geographical barriers and opens up global career possibilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto mb-12 sm:mb-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Why Choose CARRERFLOW?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built with cutting-edge technology and user experience in mind
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          <div className="flex items-start gap-6 p-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300 group hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Star size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Smart Matching</h3>
              <p className="text-gray-300 leading-relaxed">Advanced algorithms that connect the right candidates with the right opportunities.</p>
            </div>
          </div>

          <div className="flex items-start gap-6 p-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-green-500/30 transition-all duration-300 group hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Zap size={24} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Easy Application</h3>
              <p className="text-gray-300 leading-relaxed">Streamlined application process with one-click apply and saved job tracking.</p>
            </div>
          </div>

          <div className="flex items-start gap-6 p-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-purple-500/30 transition-all duration-300 group hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Globe size={24} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Updates</h3>
              <p className="text-gray-300 leading-relaxed">Instant notifications about job status, new opportunities, and application updates.</p>
            </div>
          </div>

          <div className="flex items-start gap-6 p-6 bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-yellow-500/30 transition-all duration-300 group hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Shield size={24} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Platform</h3>
              <p className="text-gray-300 leading-relaxed">Enterprise-grade security to protect your personal information and data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto text-center px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Our Impact
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Numbers that tell our success story
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 group hover:scale-105">
            <div className="text-5xl font-black text-blue-400 mb-3 group-hover:text-blue-300 transition-colors">10K+</div>
            <div className="text-gray-300 text-lg font-medium">Active Job Listings</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-green-500/30 transition-all duration-300 group hover:scale-105">
            <div className="text-5xl font-black text-green-400 mb-3 group-hover:text-green-300 transition-colors">50K+</div>
            <div className="text-gray-300 text-lg font-medium">Happy Users</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 group hover:scale-105">
            <div className="text-5xl font-black text-purple-400 mb-3 group-hover:text-purple-300 transition-colors">500+</div>
            <div className="text-gray-300 text-lg font-medium">Partner Companies</div>
          </div>
        </div>
      </section>

      {/* About Creator Section */}
      <section className="max-w-4xl mx-auto text-center px-4 mb-16">
        <Card className="bg-gradient-to-br from-black/20 via-black/15 to-black/20 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300">
          <CardHeader className="pb-6">
            <CardTitle className="text-3xl font-bold text-white mb-2">About the Creator</CardTitle>
            <p className="text-gray-400 text-lg">The mind behind CARRERFLOW</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-8">
              <div className="relative group">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="text-5xl">👨‍💻</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-xl -z-10"></div>
              </div>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white">G.Eesaan</h3>
                <p className="text-gray-300 leading-relaxed max-w-2xl text-lg">
                  Hi! I'm G.Eesaan, the creator and developer behind CARRERFLOW. I'm passionate about 
                  building innovative solutions that connect people with opportunities. This platform 
                  represents my vision of creating a seamless, user-friendly job portal that empowers 
                  both job seekers and employers.
                </p>
                <p className="text-gray-300 leading-relaxed max-w-2xl text-lg">
                  With a focus on modern web technologies and user experience, I've developed CARRERFLOW 
                  to be more than just a job board - it's a comprehensive career development platform 
                  that helps careers flow forward.
                </p>
              </div>
              {/* <div className="flex items-center gap-3 text-blue-400 text-lg font-semibold mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Heart size={20} className="text-red-400" />
                <span>Made with 💗 by G.Eesaan</span>
              </div> */}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default AboutPage;
