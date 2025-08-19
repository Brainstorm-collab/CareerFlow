import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MapPin, Building2, Briefcase, Clock, X, ChevronDown, ChevronUp, Database, AlertCircle, User, Lock } from "lucide-react";
import LandingJobCard from "@/components/landing-job-card";

import { useUser } from "@clerk/clerk-react";
import { useJobContext } from "@/context/JobContext";

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedJobType, setSelectedJobType] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");


  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const { user } = useUser();
  const { jobsList, getSavedJobsData } = useJobContext();

  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const experienceLevels = ["entry", "mid", "senior", "lead"];
  const locations = ["Mumbai, Maharashtra", "Delhi, NCR", "Bangalore, Karnataka", "Hyderabad, Telangana", "Chennai, Tamil Nadu", "Pune, Maharashtra", "Gurgaon, Haryana", "Noida, Uttar Pradesh", "Remote"];
  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Uber", "Atlassian", "IBM"];

  // Initialize filteredJobs with jobs when jobs change
  useEffect(() => {
    setFilteredJobs(jobs);
  }, [jobs]);

  useEffect(() => {
    fetchJobs();
    if (user) {
      fetchSavedJobs();
    }
  }, [user]);

  // Filter jobs whenever jobs, search term, or filters change
  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, selectedLocation, selectedCompany, selectedJobType, selectedExperience]);

  const fetchJobs = async () => {
    try {
      setError(null);
      
      // Import the local storage service functions
      const { getAllJobs } = await import('@/utils/local-storage-service');
      
      // Get all jobs from local storage (including posted jobs and sample jobs)
      const localJobs = getAllJobs();
      
      console.log('Fetched jobs from local storage:', localJobs);
      console.log('Jobs from context:', jobsList);
      
      // Ensure we have sample jobs even if local storage is empty
      if (!localJobs || localJobs.length === 0) {
        // Sample fallback jobs if no jobs are found
        const fallbackJobs = [
          {
            id: 'sample_1',
            title: 'Senior Software Engineer',
            description: 'We are looking for a Senior Software Engineer to join our team and help build scalable applications. You will work on cutting-edge technologies and collaborate with cross-functional teams.',
            requirements: [
              '5+ years of experience in software development',
              'Strong knowledge of JavaScript, Python, or Java',
              'Experience with cloud platforms (AWS, Azure, GCP)',
              'Knowledge of microservices architecture',
              'Bachelor\'s degree in Computer Science or related field'
            ],
            location: 'San Francisco, CA',
            salary_min: 120000,
            salary_max: 180000,
            job_type: 'full-time',
            experience_level: 'senior',
            remote_work: true,
            company: { name: 'Google' },
            isOpen: true
          },
          {
            id: 'sample_2',
            title: 'Frontend Developer',
            description: 'Join our frontend team to create beautiful and responsive user interfaces. You will work with modern frameworks and collaborate with designers to deliver exceptional user experiences.',
            requirements: [
              '3+ years of experience in frontend development',
              'Proficiency in React, Vue, or Angular',
              'Strong CSS and JavaScript skills',
              'Experience with responsive design',
              'Knowledge of modern build tools'
            ],
            location: 'New York, NY',
            salary_min: 80000,
            salary_max: 120000,
            job_type: 'full-time',
            experience_level: 'mid',
            remote_work: false,
            company: { name: 'Microsoft' },
            isOpen: true
          },
          {
            id: 'sample_3',
            title: 'Data Scientist',
            description: 'We are seeking a Data Scientist to analyze complex data sets and develop machine learning models. You will work on predictive analytics and help drive business decisions.',
            requirements: [
              '3+ years of experience in data science',
              'Strong Python programming skills',
              'Experience with machine learning libraries (scikit-learn, TensorFlow)',
              'Knowledge of SQL and data visualization',
              'Advanced degree in Statistics, Mathematics, or related field'
            ],
            location: 'Seattle, WA',
            salary_min: 100000,
            salary_max: 150000,
            job_type: 'full-time',
            experience_level: 'mid',
            remote_work: true,
            company: { name: 'Amazon' },
            isOpen: true
          },
          {
            id: 'sample_4',
            title: 'Product Manager',
            description: 'Lead product strategy and development for our platform. You will work closely with engineering, design, and business teams to deliver innovative solutions.',
            requirements: [
              '4+ years of product management experience',
              'Strong analytical and problem-solving skills',
              'Experience with agile methodologies',
              'Excellent communication and leadership skills',
              'Technical background preferred'
            ],
            location: 'Menlo Park, CA',
            salary_min: 130000,
            salary_max: 200000,
            job_type: 'full-time',
            experience_level: 'senior',
            remote_work: true,
            company: { name: 'Meta' },
            isOpen: true
          },
          {
            id: 'sample_5',
            title: 'DevOps Engineer',
            description: 'Build and maintain our cloud infrastructure and deployment pipelines. You will ensure high availability and scalability of our systems.',
            requirements: [
              '3+ years of DevOps experience',
              'Experience with AWS, Docker, and Kubernetes',
              'Knowledge of CI/CD pipelines',
              'Strong scripting skills (Python, Bash)',
              'Experience with monitoring and logging tools'
            ],
            location: 'Los Gatos, CA',
            salary_min: 110000,
            salary_max: 160000,
            job_type: 'full-time',
            experience_level: 'mid',
            remote_work: true,
            company: { name: 'Netflix' },
            isOpen: true
          },
          {
            id: 'sample_6',
            title: 'UX Designer',
            description: 'Create intuitive and beautiful user experiences for our products. You will conduct user research and design user interfaces that delight our customers.',
            requirements: [
              '4+ years of UX design experience',
              'Proficiency in design tools (Figma, Sketch)',
              'Experience with user research and testing',
              'Strong portfolio showcasing design work',
              'Knowledge of design systems and accessibility'
            ],
            location: 'Cupertino, CA',
            salary_min: 140000,
            salary_max: 190000,
            job_type: 'full-time',
            experience_level: 'senior',
            remote_work: false,
            company: { name: 'Apple' },
            isOpen: true
          }
        ];
        setJobs(fallbackJobs);
        return;
      }
      
      // Combine local storage jobs with in-memory jobs from context
      const combinedJobs = [...localJobs, ...jobsList];
      
      console.log('Combined jobs:', combinedJobs);
      
      // Filter to only show open jobs for candidates
      const openJobs = combinedJobs.filter(job => job.isOpen !== false);
      
      console.log('Open jobs:', openJobs);
      
      setJobs(openJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      // Use the JobContext to get saved jobs
      const savedJobsData = getSavedJobsData();
      const savedJobIds = new Set(savedJobsData.map(job => job.id));
      setSavedJobs(savedJobIds);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const filterJobs = () => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (job.company?.name && job.company.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLocation = selectedLocation === "all" || !selectedLocation || job.location === selectedLocation;
      const matchesCompany = selectedCompany === "all" || !selectedCompany || job.company?.name === selectedCompany;
      const matchesJobType = selectedJobType === "all" || !selectedJobType || job.job_type === selectedJobType;
      const matchesExperience = selectedExperience === "all" || !selectedExperience || job.experience_level === selectedExperience;

      return matchesSearch && matchesLocation && matchesCompany && matchesJobType && matchesExperience;
    });

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("all");
    setSelectedCompany("all");
    setSelectedJobType("all");
    setSelectedExperience("all");
  };

  const handleJobAction = () => {
    fetchSavedJobs();
  };

  const featuredJobs = filteredJobs.slice(0, 3);
  const regularJobs = filteredJobs.slice(3);

  // Show error state
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
              <div className="space-y-4">
                <Button 
                  onClick={fetchJobs} 
                  variant="outline" 
                  className="border-gray-600 hover:bg-gray-700/50 text-gray-200 bg-gray-800/50 transition-all duration-300 px-6 py-3"
                >
                  <Database size={18} className="mr-2" />
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-gray-700 border-t-blue-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-white mt-6 text-xl font-medium">Loading amazing opportunities...</p>
          <p className="text-gray-400 mt-2">Please wait while we fetch the latest jobs</p>
        </div>
      </div>
    );
  }

  // Check if user is a recruiter
  const isRecruiter = user?.unsafeMetadata?.role === "recruiter";

  return (
    <main className="min-h-screen py-2 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="text-center mb-8">
        <div className="relative">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-1/2 w-20 h-20 bg-green-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter mb-4">
            Latest Jobs
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto px-4">
            Discover amazing opportunities and find your next career move
          </p>
        </div>
        
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
      <div className="mb-8 space-y-4">
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


      {/* Featured Jobs - Enhanced design */}
      {featuredJobs.length > 0 && (
        <section className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
            <div>
              <h2 className="text-3xl font-bold text-white">Featured Opportunities</h2>
              <p className="text-gray-400 text-sm">Hand-picked jobs for you</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredJobs.map((job) => (
              <div key={job.id} className="relative group">
                <div className="absolute -top-3 -right-3 z-10">
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 shadow-lg">
                    ⭐ Featured
                  </Badge>
                </div>
                <div className="transform group-hover:scale-105 transition-transform duration-300">
                  <LandingJobCard
                    job={job}
                    isRecruiter={isRecruiter}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Jobs - Enhanced design */}
      {regularJobs.length > 0 && (
        <section className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-2 h-10 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500 rounded-full"></div>
            <div>
              <h2 className="text-3xl font-bold text-white">All Opportunities</h2>
              <p className="text-gray-400 text-sm">Explore all available positions</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularJobs.map((job) => (
              <LandingJobCard
                key={job.id}
                job={job}
                isRecruiter={isRecruiter}
              />
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredJobs.length === 0 && jobs.length > 0 && (
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
      {jobs.length === 0 && !loading && !error && (
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
