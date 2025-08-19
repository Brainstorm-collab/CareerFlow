import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { User, Settings, LogOut, Bookmark, FileText, Briefcase } from "lucide-react";
import { useJobContext } from "@/context/JobContext";

const CustomClerkDropdown = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const { clearUserData } = useJobContext();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      
      // Clear user data from context
      clearUserData();
      
      // Clear localStorage data
      localStorage.clear();
      
      // Sign out from Clerk
      await signOut();
      
      // Navigate to home page
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Error signing out:', error);
      // Fallback: clear data and redirect
      clearUserData();
      localStorage.clear();
      navigate('/', { replace: true });
    }
  };

  const handleMyJobs = () => {
    setIsOpen(false);
    
    // Add a small delay to ensure state update completes
    setTimeout(() => {
      if (user?.unsafeMetadata?.role === 'recruiter') {
        // Recruiter: go to posted jobs
        navigate('/my-jobs');
      } else {
        // Candidate: go to applications
        navigate('/my-applications');
      }
    }, 100);
  };

  const handleSavedJobs = () => {
    setIsOpen(false);
    
    // Add a small delay to ensure state update completes
    setTimeout(() => {
      navigate('/saved-jobs');
    }, 100);
  };

  const handleMyApplications = () => {
    setIsOpen(false);
    
    // Add a small delay to ensure state update completes
    setTimeout(() => {
      navigate('/my-applications');
    }, 100);
  };

  const handleManageAccount = () => {
    setIsOpen(false);
    // Handle manage account - you can redirect to a settings page or open Clerk's user profile
    window.open('https://accounts.clerk.dev/', '_blank');
  };

  if (!user) return null;

  const isRecruiter = user?.unsafeMetadata?.role === 'recruiter';

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`ring-2 transition-all duration-300 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg hover:scale-105 transition-transform ${
          isScrolled ? 'w-10 h-10' : 'w-12 h-12'
        } ${
          isOpen 
            ? 'ring-purple-400/70 bg-gradient-to-br from-purple-400 to-purple-500' 
            : 'ring-white/20 hover:ring-purple-400/50'
        }`}
      >
        {user.imageUrl ? (
          <img 
            src={user.imageUrl} 
            alt={user.firstName || 'User'} 
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User size={isScrolled ? 16 : 20} />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="absolute top-full right-0 mt-2 z-50 w-72 sm:w-80 bg-purple-900/95 backdrop-blur-md border border-purple-400/30 shadow-2xl shadow-purple-900/50 rounded-lg"
        >
          <div className="p-4 sm:p-5">
            {/* User Info Section */}
            <div className="flex items-center gap-3 sm:gap-4 pb-4 sm:pb-5 border-b border-purple-400/30">
              <div className="w-12 h-12 sm:w-14 sm:h-14 ring-2 ring-purple-400/50 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.firstName || 'User'} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={20} className="sm:w-6 sm:h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-base sm:text-lg truncate">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.emailAddresses[0]?.emailAddress
                  }
                </p>
                <p className="text-purple-200 text-xs sm:text-sm truncate">
                  {user.emailAddresses[0]?.emailAddress}
                </p>
              </div>
            </div>

            {/* Job Management Section */}
            <div className="py-3 space-y-2">
              {/* Saved Jobs - For both candidates and recruiters */}
              <button 
                onClick={handleSavedJobs}
                className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200 w-full text-left group cursor-pointer"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-200">
                  <Bookmark size={14} className="sm:w-4 sm:h-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium">Saved Jobs</span>
              </button>
              
              {/* My Applications - For candidates only */}
              {!isRecruiter && (
                <button 
                  onClick={handleMyApplications}
                  className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200 w-full text-left group cursor-pointer"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-200">
                    <FileText size={14} className="sm:w-4 sm:h-4 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium">My Applications</span>
                </button>
              )}
              
              {/* My Jobs - Only for recruiters */}
              {isRecruiter && (
                <button 
                  onClick={handleMyJobs}
                  className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200 w-full text-left group cursor-pointer"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-200">
                    <Briefcase size={14} className="sm:w-4 sm:h-4 text-green-400" />
                  </div>
                  <span className="text-sm font-medium">My Posted Jobs</span>
                </button>
              )}
            </div>

            {/* Account Management Section */}
            <div className="pt-3 border-t border-purple-400/30 space-y-2">
              <button 
                onClick={handleManageAccount}
                className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200 w-full text-left group cursor-pointer"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-200">
                  <Settings size={14} className="sm:w-4 sm:h-4 text-purple-400" />
                </div>
                <span className="text-sm font-medium">Manage account</span>
              </button>
              
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 text-purple-200 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 w-full text-left group cursor-pointer"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-200">
                  <LogOut size={14} className="sm:w-4 sm:h-4 text-red-400" />
                </div>
                <span className="text-sm font-medium">Sign out</span>
              </button>
            </div>

            {/* Clerk Branding */}
            <div className="pt-4 border-t border-purple-400/30">
              <div className="flex items-center justify-between text-xs text-purple-300">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">C</span>
                  </div>
                  <span className="hidden sm:inline">Secured by clerk</span>
                  <span className="sm:hidden">Clerk</span>
                </span>
                <span className="text-orange-400 font-medium text-xs">Dev</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomClerkDropdown;
