import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { PenBox, Home, Info, Briefcase, Contact, Search, Menu, X } from "lucide-react";
import CustomClerkDropdown from "./custom-clerk-dropdown";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

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
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <img 
                  src="/newlogo.png" 
                  alt="CareerFlow Logo" 
                  className={`object-contain group-hover:scale-105 transition-all duration-300 ${
                    isScrolled ? 'w-6 h-6 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-10 sm:h-10'
                  }`}
                />
              </div>
              <div className="hidden sm:block">
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

            {/* Desktop Navigation Bar - Center */}
            <nav className={`hidden lg:flex items-center space-x-6 transition-all duration-300 ${
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
                <span>Home</span>
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
                <span>About</span>
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
                <span>Contact</span>
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
                <span>Latest Jobs</span>
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
                  <span>Post Job</span>
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
                  <span>Post Job</span>
                </Link>
              </SignedIn>
            </nav>

            {/* Right Side Actions */}
            <div className={`flex gap-2 sm:gap-3 items-center transition-all duration-300`}>
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:text-blue-400 transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <SignedOut>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSignIn(true)}
                  className={`hidden sm:inline-flex border-white/20 hover:bg-white/10 text-white hover:border-blue-400 transition-all duration-300 ${
                    isScrolled ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'
                  }`}
                >
                  Login
                </Button>
              </SignedOut>
              <SignedIn>
                {/* Latest Jobs Button - For all users */}
                <Link to="/jobs" className="hidden sm:block">
                  <Button 
                    variant="outline" 
                    className={`rounded-full border-purple-500/50 hover:bg-purple-500/20 text-purple-300 hover:text-purple-200 transition-all duration-300 ${
                      isScrolled ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'
                    }`}
                  >
                    <Search size={isScrolled ? 14 : 16} className="mr-1" />
                    <span className="hidden md:inline">Latest Jobs</span>
                  </Button>
                </Link>
                
                <div className="relative">
                  <CustomClerkDropdown />
                </div>
              </SignedIn>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/20 bg-black/95 backdrop-blur-md">
              <nav className="py-4 space-y-2">
                <Link 
                  to="/" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive("/") 
                      ? "text-blue-400 bg-blue-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                
                <Link 
                  to="/about" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive("/about") 
                      ? "text-blue-400 bg-blue-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Info size={20} />
                  <span>About</span>
                </Link>
                
                <Link 
                  to="/contact" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive("/contact") 
                      ? "text-blue-400 bg-blue-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Contact size={20} />
                  <span>Contact</span>
                </Link>

                <Link 
                  to="/jobs" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                    isActive("/jobs") 
                      ? "text-purple-400 bg-purple-500/20" 
                      : "text-purple-300 hover:text-purple-400 hover:bg-purple-500/10"
                  }`}
                >
                  <Search size={20} />
                  <span>Latest Jobs</span>
                </Link>

                <SignedOut>
                  <button 
                    onClick={() => {
                      setShowSignIn(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-green-300 hover:text-green-400 hover:bg-green-500/10 w-full text-left"
                  >
                    <PenBox size={20} />
                    <span>Post Job</span>
                  </button>
                </SignedOut>
                <SignedIn>
                  <Link 
                    to="/post-job" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                      isActive("/post-job") 
                        ? "text-green-400 bg-green-500/20" 
                        : "text-green-300 hover:text-green-400 hover:bg-green-500/10"
                    }`}
                  >
                    <PenBox size={20} />
                    <span>Post Job</span>
                  </Link>
                </SignedIn>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Sign In Modal */}
      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-black/90 border border-white/20 rounded-2xl p-4 sm:p-8 shadow-2xl w-full max-w-md">
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
