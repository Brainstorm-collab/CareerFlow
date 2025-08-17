import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import { User, Settings, LogOut, Bookmark, FileText, Briefcase } from "lucide-react";
import { useJobContext } from "@/context/JobContext";
import { createPortal } from "react-dom";

const CustomClerkDropdown = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const { clearUserData } = useJobContext();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
      
      // Reposition dropdown if it's open
      if (isOpen && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const top = buttonRect.bottom + 8;
        const right = window.innerWidth - buttonRect.right;
        setDropdownPosition({ top, right });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Calculate dropdown position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const top = buttonRect.bottom + 8; // 8px gap from button
      const right = window.innerWidth - buttonRect.right;
      
      console.log('Dropdown positioning:', {
        buttonRect,
        top,
        right,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
      });
      
      setDropdownPosition({ top, right });
    }
  }, [isOpen, isScrolled]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        console.log('Click outside detected, closing dropdown');
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
        console.log('Escape key pressed, closing dropdown');
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
      console.log('Starting sign out process...');
      setIsOpen(false);
      
      // Clear user data from context
      clearUserData();
      
      // Clear localStorage data
      localStorage.clear();
      
      console.log('Local data cleared, signing out from Clerk...');
      
      // Sign out from Clerk
      await signOut();
      
      console.log('Sign out successful, redirecting...');
      
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
    if (user?.unsafeMetadata?.role === 'recruiter') {
      // Recruiter: go to posted jobs
      navigate('/my-jobs');
    } else {
      // Candidate: go to applications
      navigate('/my-applications');
    }
  };

  const handleSavedJobs = () => {
    setIsOpen(false);
    navigate('/saved-jobs');
  };

  const handleMyApplications = () => {
    setIsOpen(false);
    navigate('/my-applications');
  };

  if (!user) return null;

  const isRecruiter = user?.unsafeMetadata?.role === 'recruiter';

  // Create portal for dropdown to ensure it's rendered at document body level
  const dropdownContent = isOpen ? createPortal(
    <div 
      ref={dropdownRef}
      className="fixed z-[999999]"
      style={{
        top: `${dropdownPosition.top}px`,
        right: `${dropdownPosition.right}px`
      }}
    >
      {/* Dropdown Content */}
      <div className="w-80 bg-purple-900/95 backdrop-blur-md border border-purple-400/30 shadow-2xl shadow-purple-900/50">
        <div className="p-5">
          {/* User Info Section */}
          <div className="flex items-center gap-4 pb-5 border-b border-purple-400/30">
            <div className="w-14 h-14 ring-2 ring-purple-400/50 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl shadow-lg">
              {user.imageUrl ? (
                <img 
                  src={user.imageUrl} 
                  alt={user.firstName || 'User'} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-lg truncate">
                {user.firstName && user.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user.emailAddresses[0]?.emailAddress
                }
              </p>
              <p className="text-purple-200 text-sm truncate">
                {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>
          </div>

          {/* Job Management Section */}
          <div className="py-3">
            {/* Saved Jobs - For both candidates and recruiters */}
            <button 
              onClick={handleSavedJobs}
              className="flex items-center gap-4 px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200 w-full text-left group"
            >
              <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-200">
                <Bookmark size={16} className="text-blue-400" />
              </div>
              <span className="text-sm font-medium">Saved Jobs</span>
            </button>
            
            {/* My Applications - For candidates only */}
            {!isRecruiter && (
              <button 
                onClick={handleMyApplications}
                className="flex items-center gap-4 px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200 w-full text-left group"
              >
                <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-200">
                  <Bookmark size={16} className="text-blue-400" />
                </div>
                <span className="text-sm font-medium">My Applications</span>
              </button>
            )}
            
            {/* My Jobs - Different behavior for candidates vs recruiters */}
            <button 
              onClick={handleMyJobs}
              className="flex items-center gap-4 px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200 w-full text-left group"
            >
              <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-200">
                <Briefcase size={16} className="text-green-400" />
              </div>
              <span className="text-sm font-medium">
                {isRecruiter ? 'My Posted Jobs' : 'My Jobs'}
              </span>
            </button>
          </div>

          {/* Account Management Section */}
          <div className="pt-3 border-t border-purple-400/30">
            <button 
              onClick={() => {
                // Handle manage account - you can redirect to a settings page or open Clerk's user profile
                window.open('https://accounts.clerk.dev/', '_blank');
              }}
              className="flex items-center gap-4 px-4 py-3 text-purple-200 hover:text-white hover:bg-purple-800/50 rounded-lg transition-all duration-200 w-full text-left group"
            >
                              <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-200">
                  <Settings size={16} className="text-purple-400" />
              </div>
              <span className="text-sm font-medium">Manage account</span>
            </button>
            
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-4 px-4 py-3 text-purple-200 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 w-full text-left mt-2 group"
            >
                              <div className="w-6 h-6 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-all duration-200">
                  <LogOut size={16} className="text-red-400" />
              </div>
              <span className="text-sm font-medium">Sign out</span>
            </button>
          </div>

          {/* Clerk Branding */}
          <div className="pt-4 border-t border-purple-400/30">
            <div className="flex items-center justify-between text-xs text-purple-300">
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                Secured by clerk
              </span>
              <span className="text-orange-400 font-medium">Development mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  // Fallback dropdown for testing (positioned relative to button)
  const fallbackDropdown = isOpen ? (
    <div 
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 z-[999999]"
    >
      <div className="w-80 bg-red-500 p-4 text-white">
        <p>Fallback Dropdown - Testing</p>
        <p>IsOpen: {isOpen.toString()}</p>
        <p>Position: {JSON.stringify(dropdownPosition)}</p>
      </div>
    </div>
  ) : null;

  console.log('Dropdown render state:', { isOpen, dropdownPosition, dropdownContent: !!dropdownContent });

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          console.log('Avatar button clicked, current state:', isOpen);
          setIsOpen(!isOpen);
        }}
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

      {/* Render dropdown portal */}
      {dropdownContent}
      {fallbackDropdown}
    </div>
  );
};

export default CustomClerkDropdown;
