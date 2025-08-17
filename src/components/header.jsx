import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { PenBox, Home, Info, Briefcase, Contact, Search } from "lucide-react";
import CustomClerkDropdown from "./custom-clerk-dropdown";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-black/95 via-black/90 to-black/95 backdrop-blur-2xl border-b border-white/30 shadow-2xl shadow-black/70' 
          : 'bg-gradient-to-r from-black/80 via-black/70 to-black/80 backdrop-blur-xl border-b border-white/20 shadow-2xl shadow-black/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Single Row - Logo, Navigation, and User Actions */}
          <div className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-14' : 'h-16'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img 
                  src="/newlogo.png" 
                  alt="CareerFlow Logo" 
                  className={`object-contain group-hover:scale-105 transition-all duration-300 ${
                    isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                  }`}
                />
              </div>
              <div>
                <h1 className={`font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent transition-all duration-300 ${
                  isScrolled ? 'text-lg' : 'text-xl'
                }`}>
                  CARRERFLOW
                </h1>
                <p className={`text-gray-400 transition-all duration-300 ${
                  isScrolled ? 'text-xs' : 'text-xs'
                }`}>WHERE CAREERS FLOW FORWARD</p>
              </div>
            </Link>

            {/* Navigation Bar - Center */}
            <nav className={`flex items-center space-x-6 transition-all duration-300 ${
              isScrolled ? 'space-x-5' : 'space-x-6'
            }`}>
              <Link 
                to="/" 
                className={`flex items-center gap-2 transition-all duration-300 font-semibold text-base group ${
                  isActive("/") 
                    ? "text-blue-400" 
                    : "text-white hover:text-blue-400"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  isActive("/") 
                    ? "bg-blue-500/40" 
                    : "bg-blue-500/20 group-hover:bg-blue-500/30"
                }`}>
                  <div className={`transition-all duration-300 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}>
                    <Home size={isScrolled ? 16 : 18} />
                  </div>
                </div>
                <span className="hidden sm:inline">Home</span>
              </Link>
              
              <Link 
                to="/about" 
                className={`flex items-center gap-2 transition-all duration-300 font-medium group ${
                  isActive("/about") 
                    ? "text-blue-400" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  isActive("/about") 
                    ? "bg-blue-500/40" 
                    : "bg-white/5 group-hover:bg-white/10"
                }`}>
                  <div className={`transition-all duration-300 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}>
                    <Info size={isScrolled ? 16 : 18} />
                  </div>
                </div>
                <span className="hidden sm:inline">About</span>
              </Link>
              
              <Link 
                to="/contact" 
                className={`flex items-center gap-2 transition-all duration-300 font-medium group ${
                  isActive("/contact") 
                    ? "text-blue-400" 
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  isActive("/contact") 
                    ? "bg-blue-500/40" 
                    : "bg-white/5 group-hover:bg-white/10"
                }`}>
                  <div className={`transition-all duration-300 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}>
                    <Contact size={isScrolled ? 16 : 18} />
                  </div>
                </div>
                <span className="hidden sm:inline">Contact</span>
              </Link>

              {/* Latest Jobs link - accessible to all users */}
              <Link 
                to="/jobs" 
                className={`flex items-center gap-2 transition-all duration-300 font-medium group ${
                  isActive("/jobs") 
                    ? "text-purple-400" 
                    : "text-purple-300 hover:text-purple-400"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  isActive("/jobs") 
                    ? "bg-purple-500/40" 
                    : "bg-purple-500/20 group-hover:bg-purple-500/30"
                }`}>
                  <div className={`transition-all duration-300 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}>
                    <Search size={isScrolled ? 16 : 18} />
                  </div>
                </div>
                <span className="hidden sm:inline">Latest Jobs</span>
              </Link>

              {/* Post Job link - accessible to all users */}
              <SignedOut>
                <button 
                  onClick={() => setShowSignIn(true)}
                  className={`flex items-center gap-2 transition-all duration-300 font-medium group ${
                    isActive("/post-job") 
                      ? "text-green-400" 
                      : "text-green-300 hover:text-green-400"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isActive("/post-job") 
                      ? "bg-green-500/40" 
                      : "bg-green-500/20 group-hover:bg-green-500/30"
                  }`}>
                    <div className={`transition-all duration-300 ${
                      isScrolled ? 'scale-90' : 'scale-100'
                    }`}>
                      <PenBox size={isScrolled ? 16 : 18} />
                    </div>
                  </div>
                  <span className="hidden sm:inline">Post Job</span>
                </button>
              </SignedOut>
              <SignedIn>
                <Link 
                  to="/post-job" 
                  className={`flex items-center gap-2 transition-all duration-300 font-medium group ${
                    isActive("/post-job") 
                      ? "text-green-400" 
                      : "text-green-300 hover:text-green-400"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                    isActive("/post-job") 
                      ? "bg-green-500/40" 
                      : "bg-green-500/20 group-hover:bg-green-500/30"
                  }`}>
                    <div className={`transition-all duration-300 ${
                      isScrolled ? 'scale-90' : 'scale-100'
                    }`}>
                      <PenBox size={isScrolled ? 16 : 18} />
                    </div>
                  </div>
                  <span className="hidden sm:inline">Post Job</span>
                </Link>
              </SignedIn>
            </nav>

            {/* Right Side Actions */}
            <div className={`flex gap-3 items-center transition-all duration-300 ${
              isScrolled ? 'gap-2' : 'gap-3'
            }`}>
              <SignedOut>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSignIn(true)}
                  className={`border-white/20 hover:bg-white/10 text-white hover:border-blue-400 transition-all duration-300 ${
                    isScrolled ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'
                  }`}
                >
                  Login
                </Button>
              </SignedOut>
              <SignedIn>
                {/* Latest Jobs Button - For all users */}
                <Link to="/jobs">
                  <Button 
                    variant="outline" 
                    className={`rounded-full border-purple-500/50 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 transition-all duration-300 ${
                      isScrolled ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'
                    }`}
                  >
                    <Search size={isScrolled ? 14 : 16} className="mr-1" />
                    Latest Jobs
                  </Button>
                </Link>
                

                
                <div className="relative">
                  <CustomClerkDropdown />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-black/90 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/post-job"
              redirectUrl="/post-job"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
