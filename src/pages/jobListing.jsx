import { useState, useEffect, useMemo } from "react";
import useDebounce from "@/hooks/use-debounce";
import useRequestDeduplication from "@/hooks/use-request-deduplication";
import usePrefetch from "@/hooks/use-prefetch";
import useOptimisticUpdates from "@/hooks/use-optimistic-updates";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Building2, Briefcase, Clock, X, ChevronDown, ChevronUp, Database, AlertCircle, User, Lock, Users, TrendingUp } from "lucide-react";
import LandingJobCard from "@/components/landing-job-card";
import { LandingJobCardShimmer } from "@/components/ui/job-card-shimmer";
import VirtualJobList from "@/components/ui/virtual-job-list";

import { useAuth } from "@/context/AuthContext";
import { useJobContext } from "@/context/JobContext";
import { useGetJobs } from "@/api/apiJobs";
import { useGetSavedJobs } from "@/api/apiSavedJobs";
import { useGetUser } from "@/api/apiUsers";
import { useGetCompanies } from "@/api/apiCompanies";
import { sampleJobs } from "@/data/sampleJobs";

const JobListing = () => {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  
  // OPTIMIZATION: Progressive loading states
  const [loadingState, setLoadingState] = useState('initial');
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { user } = useAuth();
  const { jobsList, getSavedJobsData } = useJobContext();
  const databaseUser = useGetUser(user?.id);
  
  // OPTIMIZATION: Advanced performance hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const { deduplicatedRequest } = useRequestDeduplication();
  const { prefetchOnRouteChange } = usePrefetch();
  const { data: optimisticJobs, updateRealData } = useOptimisticUpdates([]);
  
  // Use Convex hooks with debounced search
  const filters = { 
    limit: 50,
    location: selectedLocation !== "all" ? selectedLocation : undefined,
    companyName: selectedCompany !== "all" ? selectedCompany : undefined,
    jobType: selectedJobType !== "all" ? selectedJobType : undefined,
    experienceLevel: selectedExperience !== "all" ? selectedExperience : undefined,
    searchQuery: debouncedSearchTerm || undefined
  };
  
  const convexJobs = useGetJobs(filters);

  // OPTIMIZATION: Only fetch companies if needed for filtering
  const databaseCompanies = useGetCompanies({ limit: 100 });
  
  // Use real jobs from database, fallback to sample jobs if none exist
  const jobs = convexJobs && convexJobs.length > 0 ? convexJobs : sampleJobs;
  
  // Update optimistic data when real data changes
  useEffect(() => {
    if (jobs) {
      updateRealData(jobs);
    }
  }, [jobs, updateRealData]);
  
  // OPTIMIZATION: Removed debug logging for better performance
  
  
  
  // OPTIMIZATION: Only fetch saved jobs if user is logged in
  const savedJobsData = useGetSavedJobs(user?.socialId || user?.id);

  const jobTypes = ["full-time", "part-time", "contract", "internship", "freelance"];
  const experienceLevels = ["entry", "mid", "senior", "lead"];
  
  // OPTIMIZATION: Memoize expensive computations
  const locations = useMemo(() => {
    return [...new Set(jobs?.map(job => job.location).filter(Boolean) || [])].sort();
  }, [jobs]);

  const companies = useMemo(() => {
    return [...new Set(jobs?.map(job => 
      typeof job.company === 'string' ? job.company : job.company?.name
    ).filter(Boolean) || [])].sort();
  }, [jobs]);

  // OPTIMIZATION: Combined useEffect with prefetching
  useEffect(() => {
    // Update filtered jobs when jobs change
    if (jobs) {
      setFilteredJobs(jobs);
    }
    
    // Update saved jobs when data changes
    if (savedJobsData) {
      const savedJobIds = new Set(savedJobsData.map(savedJob => savedJob.jobId));
      setSavedJobs(savedJobIds);
    }
    
    // Prefetch likely next routes
    prefetchOnRouteChange('/job-listing');
  }, [jobs, savedJobsData, prefetchOnRouteChange]);

  // Loading and error states from Convex
  const loading = jobs === undefined;
  const error = null; // Convex handles errors internally
  
  // OPTIMIZATION: Simplified progressive loading
  useEffect(() => {
    if (loading) {
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 30) {
            setLoadingState('initial');
            return prev + 15;
          } else if (prev < 70) {
            setLoadingState('fetching');
            return prev + 20;
          } else {
            setLoadingState('processing');
            return prev + 10;
          }
        });
      }, 150); // Faster progress updates

      return () => clearInterval(progressInterval);
    } else {
      setLoadingProgress(100);
      setLoadingState('complete');
    }
  }, [loading]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedCompany("all");
    setSelectedJobType("all");
    setSelectedExperience("all");
  };

  const handleJobAction = () => {
    // Saved jobs will update automatically via Convex
  };

  // OPTIMIZATION: Use virtual job list for better performance
  const handleJobDeleted = () => {
    // Jobs will update automatically via Convex
  };

  // Show error state (if any)
  if (error) {
    return (
      <main className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-sm border-gray-700/50 shadow-2xl">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <AlertCircle size={40} className="text-red-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Error Loading Jobs</h1>
              <p className="text-gray-300 mb-8 text-lg">
                {error}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // OPTIMIZATION: Enhanced loading states with informative messages
  const LoadingStates = {
    initial: {
      message: "Discovering amazing opportunities...",
      subMessage: "Finding the best jobs for you"
    },
    fetching: {
      message: "Loading job details...",
      subMessage: "Getting company information and requirements"
    },
    processing: {
      message: "Almost ready...",
      subMessage: "Preparing your personalized job recommendations"
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center">
            {/* Enhanced loading animation */}
            <div className="relative mb-8">
              <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-700 border-t-blue-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" 
                   style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            
            {/* Progress bar */}
            <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            
            {/* Informative messages */}
            <p className="text-white mt-6 text-xl font-medium">
              {LoadingStates[loadingState].message}
            </p>
            <p className="text-gray-400 mt-2">
              {LoadingStates[loadingState].subMessage}
            </p>
            
            {/* Shimmer preview */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <LandingJobCardShimmer key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Check if user is a recruiter (recruiters can only post jobs, not apply to them)
  const isRecruiter = databaseUser?.role === "recruiter";
  const isCandidate = databaseUser?.role === "candidate";

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Blur Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 max-w-6xl mx-auto mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
              <Briefcase size={24} className="text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Latest Jobs</h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover amazing opportunities and find your next career move
          </p>
        </div>
      </div>

      {/* Manage Jobs Section - Only for Recruiters */}
      {isRecruiter && (
        <div className="relative z-10 max-w-6xl mx-auto mb-8">
          <Card className="bg-gradient-to-r from-blue-600/20 to-purple-700/20 backdrop-blur-sm border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Building2 size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Manage Your Jobs</h2>
                    <p className="text-gray-300 text-sm">Post, edit, and manage your job listings</p>
                  </div>
                </div>
                <Link to="/post-job">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Briefcase size={16} className="mr-2" />
                    Post New Job
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/my-jobs" className="block">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Briefcase size={16} className="text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">My Jobs</h3>
                        <p className="text-gray-400 text-xs">View all your posted jobs</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link to="/job-applicants" className="block">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Users size={16} className="text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm">All Applicants</h3>
                        <p className="text-gray-400 text-xs">Manage all applications</p>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <TrendingUp size={16} className="text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm">Analytics</h3>
                      <p className="text-gray-400 text-xs">Job performance metrics</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center mb-8 relative z-10">
        <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight leading-none px-2 break-words bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-6">
          Latest Jobs
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-4">
          Discover amazing opportunities and find your next career move
        </p>
        
        {/* Recruiter Notice */}
        {isRecruiter && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-blue-300">
                <User size={20} />
                <span className="font-medium">Recruiter View</span>
              </div>
              <p className="text-blue-200 text-sm mt-2">
                You can view job postings and see applicants, but cannot apply to jobs. Use this to manage your posted jobs and review candidates.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Search and Filters Section */}
      <div className="mb-8 space-y-4 relative z-10 max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search for jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/20"
              />
            </div>
          </div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-blue-400 px-4 py-3"
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filters</span>
            {showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-white/20 text-white">
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Company Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Company</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    <SelectValue placeholder="All Companies" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-white/20 text-white">
                    <SelectItem value="all">All Companies</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Job Type</label>
                <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-white/20 text-white">
                    <SelectItem value="all">All Types</SelectItem>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Experience</label>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="bg-white/5 border-white/20 text-white hover:bg-white/10">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/95 border-white/20 text-white">
                    <SelectItem value="all">All Levels</SelectItem>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>


      {/* OPTIMIZATION: Use Virtual Job List for better performance */}
      <VirtualJobList 
        jobs={filteredJobs}
        isRecruiter={isRecruiter}
        onJobDeleted={handleJobDeleted}
        itemsPerPage={12}
      />

      {/* No Results */}
      {filteredJobs.length === 0 && jobs && jobs.length > 0 && (
        <section className="max-w-6xl mx-auto text-center py-20">
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gray-500/5 rounded-full blur-3xl"></div>
            </div>
            <div className="w-24 h-24 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={48} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No jobs found</h3>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
              Try adjusting your search criteria or filters to find more opportunities.
            </p>
            <Button 
              onClick={clearFilters} 
              variant="outline" 
              className="border-gray-600 hover:bg-gray-700/50 text-gray-200 bg-gray-800/50 transition-all duration-300 px-6 py-3"
            >
              <X size={18} className="mr-2" />
              Clear all filters
            </Button>
          </div>
        </section>
      )}

      {/* No Jobs Available */}
      {(!jobs || jobs.length === 0) && !loading && !error && (
        <section className="max-w-6xl mx-auto text-center py-20">
          <div className="relative">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 size={48} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No jobs available yet</h3>
            <p className="text-gray-400 mb-8 text-lg max-w-md mx-auto">
              Jobs will appear here once they are posted to the platform. Check back soon!
            </p>
          </div>
        </section>
      )}
      
      {/* Footer Attribution */}
      <div className="text-center py-8 mt-16">
        <p className="text-gray-400 text-sm">
          Made with 💗 by G.Eesaan
        </p>
      </div>
    </main>
  );
};

export default JobListing;
