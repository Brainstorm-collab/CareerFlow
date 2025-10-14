import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGetUser } from "../api/apiUsers";
import { Button } from "./ui/button";
import { PenBox, Home, Info, Briefcase, Contact, Search, Menu, X, User, LogOut, Bookmark, FileText, Users } from "lucide-react";
import { SocialLogin } from "./SocialLogin";
import NotificationBell from "./notification-bell";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useSearchParams();
  const { user, isSignedIn, signOut } = useAuth();
  const databaseUser = useGetUser(user?.id);
  const dropdownRef = useRef(null);

  // Debug user data
  useEffect(() => {
    // Header component ready
  }, [user, databaseUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  // Add scroll effect with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
          setIsScrolled(scrollTop > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

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
      <header className={`sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled 
          ? 'bg-gradient-to-r from-gray-900/98 via-black/95 to-gray-900/98 backdrop-blur-2xl border-b border-white/20 shadow-2xl shadow-black/50' 
          : 'bg-gradient-to-r from-gray-900/90 via-black/85 to-gray-900/90 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/30'
      }`}>
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Single Row - Logo, Navigation, and User Actions */}
          <div className={`flex items-center justify-between transition-[height] duration-300 ${
            isScrolled ? 'h-14' : 'h-16'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="relative flex items-center gap-3">
                {/* Logo - Raw image without container */}
                <div className={`transition-[width,height] duration-300 group-hover:scale-110 ${
                  isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                }`}>
                  <img 
                    src="/newlogo.png" 
                    alt="CareerFlow Logo" 
                    className={`object-contain transition-[width,height] duration-300 ${
                      isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                    }`}
                  />
                </div>
                
                {/* Title with gradient effect */}
                <h1 className={`font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent transition-[font-size] duration-300 group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 ${
                  isScrolled ? 'text-2xl' : 'text-3xl'
                }`}>
                  CareerFlow
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation Bar - Center */}
            <nav className={`hidden lg:flex items-center space-x-2 transition-all duration-500 ${
              isScrolled ? 'space-x-1' : 'space-x-2'
            }`}>
              <Link 
                to="/" 
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 font-semibold text-base group overflow-hidden ${
                  isActive("/") 
                    ? "text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20" 
                    : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                }`}
              >
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-500 ${
                  isActive("/") ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}></div>
                
                <div className={`relative p-1.5 rounded-lg transition-all duration-500 ${
                  isActive("/") 
                    ? "bg-blue-500/40 shadow-lg shadow-blue-500/30" 
                    : "bg-white/5 group-hover:bg-white/10 group-hover:shadow-md"
                }`}>
                  <div className={`transition-all duration-500 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}>
                    <Home size={isScrolled ? 16 : 18} />
                  </div>
                </div>
                <span className="relative">Home</span>
              </Link>
              
              <Link 
                to="/about" 
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 font-medium group overflow-hidden ${
                  isActive("/about") 
                    ? "text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20" 
                    : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-500 ${
                  isActive("/about") ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}></div>
                
                <div className={`relative p-1.5 rounded-lg transition-all duration-500 ${
                  isActive("/about") 
                    ? "bg-blue-500/40 shadow-lg shadow-blue-500/30" 
                    : "bg-white/5 group-hover:bg-white/10 group-hover:shadow-md"
                }`}>
                  <div className={`transition-all duration-500 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}>
                    <Info size={isScrolled ? 16 : 18} />
                  </div>
                </div>
                <span className="relative">About</span>
              </Link>
              
              <Link 
                to="/contact" 
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 font-medium group overflow-hidden ${
                  isActive("/contact") 
                    ? "text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20" 
                    : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-500 ${
                  isActive("/contact") ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}></div>
                
                <div className={`relative p-1.5 rounded-lg transition-all duration-500 ${
                  isActive("/contact") 
                    ? "bg-blue-500/40 shadow-lg shadow-blue-500/30" 
                    : "bg-white/5 group-hover:bg-white/10 group-hover:shadow-md"
                }`}>
                  <div className={`transition-all duration-500 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}>
                    <Contact size={isScrolled ? 16 : 18} />
                  </div>
                </div>
                <span className="relative">Contact</span>
              </Link>

              {/* Latest Jobs link - accessible to all users */}
              <Link 
                to="/jobs" 
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 font-medium group overflow-hidden ${
                  isActive("/jobs") 
                    ? "text-white bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 shadow-lg shadow-purple-500/20" 
                    : "text-purple-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-purple-400/30"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 transition-all duration-500 ${
                  isActive("/jobs") ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}></div>
                
                <div className={`relative p-1.5 rounded-lg transition-all duration-500 ${
                  isActive("/jobs") 
                    ? "bg-purple-500/40 shadow-lg shadow-purple-500/30" 
                    : "bg-purple-500/20 group-hover:bg-purple-500/30 group-hover:shadow-md"
                }`}>
                  <div className={`transition-all duration-500 ${
                    isScrolled ? 'scale-90' : 'scale-100'
                  }`}>
                    <Search size={isScrolled ? 16 : 18} />
                  </div>
                </div>
                <span className="relative">Latest Jobs</span>
              </Link>

              {/* Post Job link - role-based access */}
              {!isSignedIn ? (
                <button 
                  onClick={() => navigate('/sign-in')}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 font-medium group overflow-hidden ${
                    isActive("/post-job") 
                      ? "text-white bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/50 shadow-lg shadow-green-500/20" 
                      : "text-green-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-green-400/30"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 transition-all duration-500 ${
                    isActive("/post-job") ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  
                  <div className={`relative p-1.5 rounded-lg transition-all duration-500 ${
                    isActive("/post-job") 
                      ? "bg-green-500/40 shadow-lg shadow-green-500/30" 
                      : "bg-green-500/20 group-hover:bg-green-500/30 group-hover:shadow-md"
                  }`}>
                    <div className={`transition-all duration-500 ${
                      isScrolled ? 'scale-90' : 'scale-100'
                    }`}>
                      <PenBox size={isScrolled ? 16 : 18} />
                    </div>
                  </div>
                  <span className="relative">Post Job</span>
                </button>
              ) : databaseUser?.role === 'recruiter' ? (
                <Link 
                  to="/post-job" 
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 font-medium group overflow-hidden ${
                    isActive("/post-job") 
                      ? "text-white bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/50 shadow-lg shadow-green-500/20" 
                      : "text-green-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-green-400/30"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 transition-all duration-500 ${
                    isActive("/post-job") ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  
                  <div className={`relative p-1.5 rounded-lg transition-all duration-500 ${
                    isActive("/post-job") 
                      ? "bg-green-500/40 shadow-lg shadow-green-500/30" 
                      : "bg-green-500/20 group-hover:bg-green-500/30 group-hover:shadow-md"
                  }`}>
                    <div className={`transition-all duration-500 ${
                      isScrolled ? 'scale-90' : 'scale-100'
                    }`}>
                      <PenBox size={isScrolled ? 16 : 18} />
                    </div>
                  </div>
                  <span className="relative">Post Job</span>
                </Link>
              ) : (
                <button 
                  onClick={() => navigate('/unauthorized')}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-500 font-medium group overflow-hidden ${
                    isActive("/post-job") 
                      ? "text-white bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/50 shadow-lg shadow-green-500/20" 
                      : "text-green-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-green-400/30"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 transition-all duration-500 ${
                    isActive("/post-job") ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}></div>
                  
                  <div className={`relative p-1.5 rounded-lg transition-all duration-500 ${
                    isActive("/post-job") 
                      ? "bg-green-500/40 shadow-lg shadow-green-500/30" 
                      : "bg-green-500/20 group-hover:bg-green-500/30 group-hover:shadow-md"
                  }`}>
                    <div className={`transition-all duration-500 ${
                      isScrolled ? 'scale-90' : 'scale-100'
                    }`}>
                      <PenBox size={isScrolled ? 16 : 18} />
                    </div>
                  </div>
                  <span className="relative">Post Job</span>
                </button>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className={`flex gap-2 sm:gap-3 items-center transition-all duration-500`}>
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white hover:text-blue-400 transition-all duration-500 group"
              >
                <div className="transition-all duration-500 group-hover:scale-110">
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </div>
              </button>

              {!isSignedIn ? (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/sign-in')}
                  className={`hidden sm:inline-flex bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-400/50 text-white hover:text-white transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/20 ${
                    isScrolled ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2'
                  }`}
                >
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">Login</span>
                </Button>
              ) : (
                <>
                  {/* Notifications */}
                  <NotificationBell />
                  
                  {/* User Dropdown */}
                <div className="relative user-dropdown flex items-center gap-2" ref={dropdownRef}>
                    <button
                      onClick={() => setShowUserDropdown(!showUserDropdown)}
                      className="flex items-center justify-center p-1 rounded-full hover:bg-white/10 transition-all duration-500 group border border-transparent hover:border-white/20"
                    >
                      <div className="relative">
                        {(databaseUser?.profileImageUrl || user?.picture) ? (
                          <img
                            src={databaseUser?.profileImageUrl || user?.picture}
                            alt={user?.name || 'User'}
                            className={`rounded-full object-cover border border-white/20 transition-all duration-300 ${
                              isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                            }`}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              // Replace with fallback
                              e.target.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = `rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center transition-all duration-300 ${
                                isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                              }`;
                              fallback.innerHTML = `<svg class="w-${isScrolled ? '5' : '6'} h-${isScrolled ? '5' : '6'} text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
                              e.target.parentNode.appendChild(fallback);
                            }}
                          />
                        ) : (
                          <div className={`rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center transition-all duration-300 ${
                            isScrolled ? 'w-10 h-10' : 'w-12 h-12'
                          }`}>
                            <User size={isScrolled ? 20 : 24} className="text-white" />
                          </div>
                        )}
                      </div>
                    </button>
                    
                    {/* User Role Display - Next to Profile Icon */}
                    <div className={`text-xs font-semibold transition-all duration-500 ${
                      databaseUser?.role === 'recruiter' 
                        ? 'text-green-300' 
                        : 'text-blue-300'
                    }`}>
                      {databaseUser?.role === 'recruiter' ? '👨‍💼 Recruiter' : '👤 Candidate'}
                    </div>
                    
                    {showUserDropdown && (
                      <div className="absolute right-0 top-full mt-3 w-80 bg-gradient-to-br from-gray-900 via-black to-gray-900 backdrop-blur-2xl border border-white/30 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
                        {/* Animated background effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-500/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                        
                        <div className="relative">
                          {/* User Profile Header */}
                          <div className="px-6 py-6 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 relative overflow-hidden">
                            {/* Header background pattern */}
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
                            
                            <div className="flex items-center gap-4 relative">
                              <div className="relative group">
                                {(databaseUser?.profileImageUrl || user?.picture) ? (
                                  <img
                                    src={databaseUser?.profileImageUrl || user?.picture}
                                    alt={user?.name || 'User'}
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300"
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const fallback = document.createElement('div');
                                      fallback.className = 'w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300';
                                      fallback.innerHTML = `<svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`;
                                      e.target.parentNode.appendChild(fallback);
                                    }}
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <User size={28} className="text-white" />
                                  </div>
                                )}
                                {/* Online status indicator with pulse */}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900">
                                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                                </div>
                                {/* Profile ring effect */}
                                <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xl font-bold text-white truncate mb-1">{user?.name || 'User'}</p>
                                <p className="text-sm text-gray-300 truncate mb-2">{user?.email}</p>
                                <div className="flex items-center gap-2">
                                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
                                    databaseUser?.role === 'recruiter' 
                                      ? 'bg-green-500/20 text-green-300 border-green-400/30 hover:bg-green-500/30' 
                                      : 'bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-blue-500/30'
                                  }`}>
                                    {databaseUser?.role === 'recruiter' ? '👨‍💼 Recruiter' : '👤 Candidate'}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Active now
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Navigation Menu */}
                          <div className="py-3">
                            <Link
                              to="/profile"
                              className="flex items-center gap-4 px-6 py-4 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 transition-all duration-300 group relative overflow-hidden mx-2 rounded-xl"
                              onClick={() => setShowUserDropdown(false)}
                            >
                              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                                {databaseUser?.role === 'recruiter' ? (
                                  <Users size={20} className="text-blue-400" />
                                ) : (
                                  <User size={20} className="text-blue-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-base">
                                  {databaseUser?.role === 'recruiter' ? 'Manage Applicants' : 'Profile'}
                                </span>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {databaseUser?.role === 'recruiter' ? 'Review job applications' : 'Manage your account'}
                                </p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                              </div>
                            </Link>

                            {/* Show "Posted Jobs" only for recruiters */}
                            {databaseUser?.role === 'recruiter' && (
                              <Link
                                to="/my-jobs"
                                className="flex items-center gap-4 px-6 py-4 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 transition-all duration-300 group relative overflow-hidden mx-2 rounded-xl"
                                onClick={() => setShowUserDropdown(false)}
                              >
                                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-green-500 to-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:from-green-500/30 group-hover:to-emerald-500/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                                  <Briefcase size={20} className="text-green-400" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-base">Posted Jobs</span>
                                  <p className="text-xs text-gray-400 mt-0.5">Manage your job postings</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                </div>
                            </Link>
                          )}

                            {/* Show "Candidates" only for recruiters */}
                            {databaseUser?.role === 'recruiter' && (
                              <Link
                                to="/candidates"
                                className="flex items-center gap-4 px-6 py-4 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 group relative overflow-hidden mx-2 rounded-xl"
                                onClick={() => setShowUserDropdown(false)}
                              >
                                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                                  <Users size={20} className="text-purple-400" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-base">Browse Candidates</span>
                                  <p className="text-xs text-gray-400 mt-0.5">Discover talented candidates</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                </div>
                              </Link>
                            )}

                            {/* Show "My Applications" only for candidates */}
                            {databaseUser?.role !== 'recruiter' && (
                              <Link
                                to="/my-applications"
                                className="flex items-center gap-4 px-6 py-4 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300 group relative overflow-hidden mx-2 rounded-xl"
                                onClick={() => setShowUserDropdown(false)}
                              >
                                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                                  <Search size={20} className="text-purple-400" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-base">My Applications</span>
                                  <p className="text-xs text-gray-400 mt-0.5">Track your applications</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                                </div>
                              </Link>
                            )}

                          <Link
                            to="/saved-jobs"
                              className="flex items-center gap-4 px-6 py-4 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 transition-all duration-300 group relative overflow-hidden mx-2 rounded-xl"
                            onClick={() => setShowUserDropdown(false)}
                          >
                              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                              <div className="p-2.5 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 group-hover:from-yellow-500/30 group-hover:to-orange-500/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                                <Bookmark size={20} className="text-yellow-400" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-base">Saved Jobs</span>
                                <p className="text-xs text-gray-400 mt-0.5">Your bookmarked jobs</p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                              </div>
                          </Link>

                            {/* Show "My Resumes" only for candidates */}
                            {databaseUser?.role === 'candidate' && (
                          <Link
                            to="/my-resumes"
                                className="flex items-center gap-4 px-6 py-4 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-blue-500/10 transition-all duration-300 group relative overflow-hidden mx-2 rounded-xl"
                            onClick={() => setShowUserDropdown(false)}
                          >
                                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 group-hover:from-indigo-500/30 group-hover:to-blue-500/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                                  <FileText size={20} className="text-indigo-400" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-semibold text-base">My Resumes</span>
                                  <p className="text-xs text-gray-400 mt-0.5">Manage your files</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                                </div>
                          </Link>
                            )}

                            {/* Separator */}
                            <div className="mx-6 my-4 border-t border-white/10"></div>

                            {/* Sign Out */}
                          <button
                            onClick={() => {
                              signOut();
                              setShowUserDropdown(false);
                              navigate('/');
                            }}
                              className="flex items-center gap-4 px-6 py-4 text-sm text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 transition-all duration-300 w-full text-left group relative overflow-hidden mx-2 rounded-xl"
                            >
                              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-red-500 to-pink-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                              <div className="p-2.5 rounded-xl bg-gradient-to-br from-red-500/20 to-pink-500/20 group-hover:from-red-500/30 group-hover:to-pink-500/30 transition-all duration-300 group-hover:scale-110 shadow-lg">
                                <LogOut size={20} className="text-red-400" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-base">Sign Out</span>
                                <p className="text-xs text-gray-400 mt-0.5">End your session</p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                              </div>
                          </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/20 bg-gradient-to-br from-gray-900/98 to-black/98 backdrop-blur-2xl">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              
              {/* Mobile Logo Section */}
              <div className="relative px-4 py-4 border-b border-white/10">
                <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-12 h-12">
                    <img 
                      src="/newlogo.png" 
                      alt="CareerFlow Logo" 
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <span className="text-xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">CareerFlow</span>
                </Link>
              </div>
              
              <nav className="relative py-4 space-y-1 px-4">
                <Link 
                  to="/" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 font-medium group ${
                    isActive("/") 
                      ? "text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-500 ${
                    isActive("/") 
                      ? "bg-blue-500/40 shadow-lg shadow-blue-500/30" 
                      : "bg-white/5 group-hover:bg-white/10 group-hover:shadow-md"
                  }`}>
                    <Home size={18} />
                  </div>
                  <span>Home</span>
                </Link>
                
                <Link 
                  to="/about" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 font-medium group ${
                    isActive("/about") 
                      ? "text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-500 ${
                    isActive("/about") 
                      ? "bg-blue-500/40 shadow-lg shadow-blue-500/30" 
                      : "bg-white/5 group-hover:bg-white/10 group-hover:shadow-md"
                  }`}>
                    <Info size={18} />
                  </div>
                  <span>About</span>
                </Link>
                
                <Link 
                  to="/contact" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 font-medium group ${
                    isActive("/contact") 
                      ? "text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50 shadow-lg shadow-blue-500/20" 
                      : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-500 ${
                    isActive("/contact") 
                      ? "bg-blue-500/40 shadow-lg shadow-blue-500/30" 
                      : "bg-white/5 group-hover:bg-white/10 group-hover:shadow-md"
                  }`}>
                    <Contact size={18} />
                  </div>
                  <span>Contact</span>
                </Link>

                <Link 
                  to="/jobs" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 font-medium group ${
                    isActive("/jobs") 
                      ? "text-white bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400/50 shadow-lg shadow-purple-500/20" 
                      : "text-purple-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-purple-400/30"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all duration-500 ${
                    isActive("/jobs") 
                      ? "bg-purple-500/40 shadow-lg shadow-purple-500/30" 
                      : "bg-purple-500/20 group-hover:bg-purple-500/30 group-hover:shadow-md"
                  }`}>
                    <Search size={18} />
                  </div>
                  <span>Latest Jobs</span>
                </Link>

                {!isSignedIn ? (
                <button 
                  onClick={() => {
                      navigate('/sign-in');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 font-medium text-green-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-green-400/30 w-full text-left group"
                  >
                    <div className="p-1.5 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 group-hover:shadow-md transition-all duration-500">
                      <PenBox size={18} />
                    </div>
                    <span>Post Job</span>
                  </button>
                ) : databaseUser?.role === 'recruiter' ? (
                  <Link 
                    to="/post-job" 
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 font-medium group ${
                      isActive("/post-job") 
                        ? "text-white bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-400/50 shadow-lg shadow-green-500/20" 
                        : "text-green-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-green-400/30"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-all duration-500 ${
                      isActive("/post-job") 
                        ? "bg-green-500/40 shadow-lg shadow-green-500/30" 
                        : "bg-green-500/20 group-hover:bg-green-500/30 group-hover:shadow-md"
                    }`}>
                      <PenBox size={18} />
                    </div>
                    <span>Post Job</span>
                  </Link>
                ) : (
                  <button 
                    onClick={() => {
                      navigate('/unauthorized');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 font-medium text-green-300 hover:text-white hover:bg-white/10 border border-transparent hover:border-green-400/30 w-full text-left group"
                  >
                    <div className="p-1.5 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 group-hover:shadow-md transition-all duration-500">
                      <PenBox size={18} />
                    </div>
                    <span>Post Job</span>
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Sign In Modal */}
              {false && showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 shadow-2xl">
                <img 
                  src="/newlogo.png" 
                  alt="CareerFlow Logo" 
                  className="w-full h-full object-contain drop-shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center hidden">
                  <span className="text-3xl">👋</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
                Sign in to CareerFlow
              </h2>
              <p className="text-sm text-gray-300">Welcome back! Sign in to continue</p>
            </div>
            
            {/* Social Login Buttons */}
            <SocialLogin onSuccess={() => setShowSignIn(false)} />
            
            {/* Divider */}
            <div className="mt-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gradient-to-br from-gray-900/95 to-black/95 text-gray-400">OR</span>
                </div>
              </div>
            </div>

            {/* Email/Password Form */}
            <div className="mt-4 space-y-3">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-8 pr-3 py-2 bg-white/10 text-white placeholder:text-gray-400 border border-white/20 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-sm"
                  />
                  <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full pl-8 pr-8 py-2 bg-white/10 text-white placeholder:text-gray-400 border border-white/20 rounded-md focus:border-blue-500 focus:outline-none transition-colors text-sm"
                  />
                  <svg className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowSignIn(false);
                    navigate('/forgot-password');
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Sign In Button */}
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 rounded-md transition-all duration-200 shadow-lg hover:shadow-xl text-sm">
                Sign In
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-300">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setShowSignIn(false);
                    navigate('/sign-up');
                  }}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up here
                </button>
              </p>
            </div>

            {/* Guest Login */}
            <div className="mt-3 text-center">
              <button
                onClick={() => {
                  setShowSignIn(false);
                  navigate('/');
                }}
                className="text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                Continue as Guest
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                © CareerFlow team
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
