import JobCard from "@/components/job-card";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { FileText, CheckCircle, Clock, User, MapPin, Building2, DollarSign, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useJobContext } from "@/context/JobContext";
import { Link } from "react-router-dom";
import { useGetApplicationsByCandidate } from "@/api/apiApplication";

const MyApplications = () => {
  const { isLoading, user } = useAuth();
  const { getAppliedJobsData } = useJobContext();
  
  // Use Convex hook to get applications
  const applications = useGetApplicationsByCandidate(user?.id);

  // Helper function to get Supabase user ID from Clerk ID
  const getSupabaseUserId = async (clerkUserId) => {
    if (!clerkUserId) return null;
    
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('clerk_id', clerkUserId)
        .single();
      
      if (error) {
        console.error('Error getting Supabase user ID:', error);
        return null;
      }
      
      return data?.id;
    } catch (error) {
      console.error('Error in getSupabaseUserId:', error);
      return null;
    }
  };

  // Fetch applied jobs from Supabase and local context
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log('⚠️ No user found, skipping fetch');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log('🔄 Fetching applied jobs for user:', user.id);
        console.log('🔄 User details:', { id: user.id, email: user.email, fullName: user.fullName });
        
        // Get Supabase user ID first
        const userId = await getSupabaseUserId(user.id);
        if (!userId) {
          console.log('⚠️ No Supabase user ID found, falling back to local data');
          setSupabaseUserId(null);
        } else {
          setSupabaseUserId(userId);
          console.log('✅ Supabase user ID:', userId);
        }
        
        // First try to get from Supabase
        try {
          const supabase = getSupabaseClient();
          
          const { data, error } = await supabase
            .from('applications')
            .select(`
              id,
              status,
              applied_at,
              updated_at,
              resume_url,
              notes,
              rating,
              jobs (
                id,
                title,
                slug,
                description,
                location,
                job_type,
                experience_level,
                salary_min,
                salary_max,
                salary_currency,
                remote_work,
                created_at,
                companies (
                  id,
                  name,
                  logo_url,
                  industry,
                  website_url
                )
              )
            `)
            .eq('candidate_id', userId)
            .order('applied_at', { ascending: false });

          if (error) {
            console.error('❌ Error fetching applications from Supabase:', error);
            throw new Error(`Failed to fetch applications: ${error.message}`);
          }

          if (data && data.length > 0) {
            console.log('✅ Successfully fetched', data.length, 'applications from Supabase');
            
            // Transform the data to match expected format
            const transformedApplications = data.map(app => ({
              id: app.jobs?.id,
              title: app.jobs?.title,
              slug: app.jobs?.slug,
              description: app.jobs?.description,
              location: app.jobs?.location,
              job_type: app.jobs?.job_type,
              experience_level: app.jobs?.experience_level,
              salary_min: app.jobs?.salary_min,
              salary_max: app.jobs?.salary_max,
              salary_currency: app.jobs?.salary_currency,
              remote_work: app.jobs?.remote_work,
              created_at: app.jobs?.created_at,
              // Application specific data
              application_id: app.id,
              application_status: app.status,
              applied_at: app.applied_at,
              updated_at: app.updated_at,
              resume_url: app.resume_url,
              notes: app.notes,
              rating: app.rating,
              // Company data
              company: {
                id: app.jobs?.companies?.id,
                name: app.jobs?.companies?.name,
                logo_url: app.jobs?.companies?.logo_url,
                industry: app.jobs?.companies?.industry,
                website_url: app.jobs?.companies?.website_url
              }
            }));
            
            setAppliedJobs(transformedApplications);
            console.log('📊 Applications data transformed and set from Supabase');
            return;
          }
        } catch (supabaseError) {
          console.warn('⚠️ Supabase fetch failed, falling back to local storage:', supabaseError);
        }
        
        // Fallback to local context data
        console.log('🔄 Falling back to local context data');
        const localAppliedJobs = getAppliedJobsData();
        
        if (localAppliedJobs && localAppliedJobs.length > 0) {
          console.log('✅ Found', localAppliedJobs.length, 'applications in local context');
          
          // Transform local data to match expected format
          const transformedLocalApplications = localAppliedJobs.map(job => ({
            id: job.id,
            title: job.title,
            slug: job.slug,
            description: job.description,
            location: job.location,
            job_type: job.job_type,
            experience_level: job.experience_level,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            salary_currency: job.salary_currency,
            remote_work: job.remote_work,
            created_at: job.created_at,
            // Application specific data (default values for local data)
            application_id: `local_${job.id}`,
            application_status: 'pending',
            applied_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            resume_url: null,
            notes: null,
            rating: null,
            // Company data
            company: {
              id: job.company?.id,
              name: job.company?.name,
              logo_url: job.company?.logo_url,
              industry: job.company?.industry,
              website_url: job.company?.website_url
            }
          }));
          
          setAppliedJobs(transformedLocalApplications);
          console.log('📊 Local applications data transformed and set');
        } else {
          console.log('ℹ️ No applications found in local context either');
          setAppliedJobs([]);
        }
        
      } catch (error) {
        console.error('❌ Error fetching applied jobs:', error);
        setAppliedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, getAppliedJobsData]);

  const handleJobAction = () => {
    // Refresh applied jobs when needed
    if (user) {
      // Re-run the fetch data function to get latest data
      const fetchData = async () => {
        try {
          // Try Supabase first, then fallback to local
          const supabase = getSupabaseClient();
          
          const { data, error } = await supabase
            .from('applications')
            .select(`
              id,
              status,
              applied_at,
              updated_at,
              resume_url,
              notes,
              rating,
              jobs (
                id,
                title,
                slug,
                description,
                location,
                job_type,
                experience_level,
                salary_min,
                salary_max,
                salary_currency,
                remote_work,
                created_at,
                companies (
                  id,
                  name,
                  logo_url,
                  industry,
                  website_url
                )
              )
            `)
            .eq('candidate_id', userId)
            .order('applied_at', { ascending: false });

          if (!error && data && data.length > 0) {
            const transformedApplications = data.map(app => ({
              id: app.jobs?.id,
              title: app.jobs?.title,
              slug: app.jobs?.slug,
              description: app.jobs?.description,
              location: app.jobs?.location,
              job_type: app.jobs?.job_type,
              experience_level: app.jobs?.experience_level,
              salary_min: app.jobs?.salary_min,
              salary_max: app.jobs?.salary_max,
              salary_currency: app.jobs?.salary_currency,
              remote_work: app.jobs?.remote_work,
              created_at: app.jobs?.created_at,
              application_id: app.id,
              application_status: app.status,
              applied_at: app.applied_at,
              updated_at: app.updated_at,
              resume_url: app.resume_url,
              notes: app.notes,
              rating: app.rating,
              company: {
                id: app.jobs?.companies?.id,
                name: app.jobs?.companies?.name,
                logo_url: app.jobs?.companies?.logo_url,
                industry: app.jobs?.companies?.industry,
                website_url: app.jobs?.companies?.website_url
              }
            }));
            setAppliedJobs(transformedApplications);
          } else {
            // Fallback to local data
            const localAppliedJobs = getAppliedJobsData();
            if (localAppliedJobs && localAppliedJobs.length > 0) {
              const transformedLocalApplications = localAppliedJobs.map(job => ({
                id: job.id,
                title: job.title,
                slug: job.slug,
                description: job.description,
                location: job.location,
                job_type: job.job_type,
                experience_level: job.experience_level,
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                salary_currency: job.salary_currency,
                remote_work: job.remote_work,
                created_at: job.created_at,
                application_id: `local_${job.id}`,
                application_status: 'pending',
                applied_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                resume_url: null,
                notes: null,
                rating: null,
                company: {
                  id: job.company?.id,
                  name: job.company?.name,
                  logo_url: job.company?.logo_url,
                  industry: job.company?.industry,
                  website_url: job.company?.website_url
                }
              }));
              setAppliedJobs(transformedLocalApplications);
            }
          }
        } catch (error) {
          console.error('Error refreshing applications:', error);
        }
      };
      
      fetchData();
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-white mt-4 text-lg">Loading your applications...</p>
            <p className="text-sm text-gray-400 mt-2">User: {user?.email || 'Not logged in'}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={40} className="text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
              <p className="text-gray-300 mb-6 text-lg">
                Please sign in to view your job applications.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  // Show no applications message if no jobs found
  if (appliedJobs.length === 0) {
    return (
      <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-black/20 backdrop-blur-sm border-white/10">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={40} className="text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">No Applications Yet</h1>
              <p className="text-gray-300 mb-6 text-lg">
                You haven't applied to any jobs yet. Start browsing available positions and apply to jobs that interest you.
              </p>
              
              {/* Debug information */}
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-white font-semibold mb-2">Debug Info:</h3>
                <p className="text-sm text-gray-300">User ID: {user?.id || 'Not available'}</p>
                <p className="text-sm text-gray-300">User Email: {user?.email || 'Not available'}</p>
                <p className="text-sm text-gray-300">Applied Jobs Count: {appliedJobs.length}</p>
                <p className="text-sm text-gray-300">Local Context Data: {getAppliedJobsData()?.length || 0} jobs</p>
              </div>
              
              <Link
                to="/jobs"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Jobs
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="gradient-title font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tighter mb-4">
            My Applications
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
            Track all the jobs you've applied to and their current status
          </p>
        </div>

        {/* Applications Count */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-blue-500/20 border border-blue-500/30 rounded-full px-6 py-3">
            <CheckCircle size={20} className="text-blue-400" />
            <span className="text-blue-300 font-medium">
              {appliedJobs.length} Application{appliedJobs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Applications List */}
        {appliedJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={48} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
            <p className="text-gray-400 mb-6">
              Start applying to jobs and track your applications here!
            </p>
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
            >
              Browse Jobs
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {appliedJobs.map((application) => (
              <Card key={application.application_id} className="bg-black/20 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      <img 
                        src={application.company?.logo_url || '/companies/default.svg'} 
                        alt={`${application.company?.name} logo`}
                        className="w-16 h-16 object-contain rounded-lg bg-white/10 p-2 border border-white/20"
                        onError={(e) => {
                          e.target.src = '/companies/default.svg';
                        }}
                      />
                    </div>
                    
                    {/* Job Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{application.title}</h3>
                          <div className="flex items-center gap-2 text-gray-300 mb-2">
                            <Building2 size={16} className="text-blue-400" />
                            <span>{application.company?.name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-300 mb-2">
                            <MapPin size={16} className="text-green-400" />
                            <span>{application.location}</span>
                          </div>
                        </div>
                        
                        {/* Application Status */}
                        <div className="flex flex-col items-end gap-2">
                          <Badge 
                            className={`px-3 py-1 text-sm font-medium ${
                              application.application_status === 'pending' 
                                ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                                : application.application_status === 'reviewing'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : application.application_status === 'shortlisted'
                                ? 'bg-green-500/20 text-green-300 border-green-500/30'
                                : application.application_status === 'interview'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                : application.application_status === 'accepted'
                                ? 'bg-green-600/20 text-green-400 border-green-600/30'
                                : application.application_status === 'rejected'
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            }`}
                          >
                            {application.application_status?.charAt(0).toUpperCase() + application.application_status?.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-1 text-gray-400 text-sm">
                            <Calendar size={14} />
                            <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Job Details Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-gray-300">
                          <User size={16} className="text-purple-400" />
                          <span className="capitalize">{application.job_type?.replace('-', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock size={16} className="text-orange-400" />
                          <span className="capitalize">{application.experience_level}</span>
                        </div>
                        {(application.salary_min || application.salary_max) && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <DollarSign size={16} className="text-yellow-400" />
                            <span>
                              {application.salary_min && application.salary_max 
                                ? `₹${(application.salary_min / 100000).toFixed(1)}L - ₹${(application.salary_max / 100000).toFixed(1)}L`
                                : application.salary_min 
                                  ? `₹${(application.salary_min / 100000).toFixed(1)}L+`
                                  : `Up to ₹${(application.salary_max / 100000).toFixed(1)}L`
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Resume Link */}
                      {application.resume_url && (
                        <div className="mb-4">
                          <a 
                            href={application.resume_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            <FileText size={16} />
                            <span>View Submitted Resume</span>
                          </a>
                        </div>
                      )}
                      
                      {/* Notes from Recruiter */}
                      {application.notes && (
                        <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                          <h4 className="text-sm font-medium text-gray-300 mb-1">Recruiter Notes:</h4>
                          <p className="text-gray-400 text-sm">{application.notes}</p>
                        </div>
                      )}
                      
                      {/* Rating */}
                      {application.rating && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-300">Rating:</span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-lg ${i < application.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="text-sm text-gray-400 ml-2">({application.rating}/5)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer Attribution */}
      <div className="text-center py-8 mt-16">
        <p className="text-gray-400 text-sm">
          Made with 💗 by G.Eesaan
        </p>
      </div>
    </main>
  );
};

export default MyApplications;
