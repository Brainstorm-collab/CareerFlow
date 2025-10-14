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
  
  // Loading state from Convex
  const loading = applications === undefined;

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-yellow-500/20 text-yellow-300', icon: Clock, label: 'Pending' };
      case 'reviewed':
        return { color: 'bg-blue-500/20 text-blue-300', icon: FileText, label: 'Under Review' };
      case 'shortlisted':
        return { color: 'bg-green-500/20 text-green-300', icon: CheckCircle, label: 'Shortlisted' };
      case 'scheduled_for_interview':
        return { color: 'bg-purple-500/20 text-purple-300', icon: Calendar, label: 'Interview Scheduled' };
      case 'interviewed':
        return { color: 'bg-indigo-500/20 text-indigo-300', icon: CheckCircle, label: 'Interviewed' };
      case 'rejected':
        return { color: 'bg-red-500/20 text-red-300', icon: X, label: 'Rejected' };
      case 'hired':
        return { color: 'bg-emerald-500/20 text-emerald-300', icon: CheckCircle, label: 'Hired' };
      default:
        return { color: 'bg-gray-500/20 text-gray-300', icon: Clock, label: 'Unknown' };
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-700 border-t-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-12 text-center">
              <User size={48} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold text-white mb-2">Please sign in</h2>
              <p className="text-gray-400 mb-6">You need to be signed in to view your applications.</p>
              <Link to="/sign-in" className="inline-block">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Sign In
                </button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
          <p className="text-gray-400">Track the status of your job applications</p>
        </div>

        {/* Applications List */}
        {applications && applications.length > 0 ? (
          <div className="space-y-6">
            {applications.map((application) => {
              const statusInfo = getStatusInfo(application.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={application._id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Company Logo */}
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            {application.job?.company?.logoUrl ? (
                              <img 
                                src={application.job.company.logoUrl} 
                                alt={application.job.company.name}
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              <Building2 size={24} className="text-gray-400" />
                            )}
                          </div>
                          
                          {/* Job Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-semibold text-white mb-1">
                              {application.job?.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                              <div className="flex items-center gap-1">
                                <Building2 size={16} />
                                <span>{application.job?.company?.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                <span>{application.job?.location}</span>
                              </div>
                              {application.job?.salaryMin && (
                                <div className="flex items-center gap-1">
                                  <DollarSign size={16} />
                                  <span>
                                    {application.job.salaryMin.toLocaleString()}
                                    {application.job.salaryMax && ` - ${application.job.salaryMax.toLocaleString()}`}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar size={16} />
                              <span>Applied on {new Date(application.appliedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Status */}
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${statusInfo.color} border-0`}>
                          <StatusIcon size={14} className="mr-1" />
                          {statusInfo.label}
                        </Badge>
                        
                        {/* Action Button */}
                        <Link to={`/job/${application.job?._id}`}>
                          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                            View Job Details
                          </button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Application Notes */}
                    {application.notes && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-300">
                          <strong>Notes:</strong> {application.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* No Applications */
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-12 text-center">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-semibold text-white mb-2">No Applications Yet</h2>
              <p className="text-gray-400 mb-6">
                You haven't applied to any jobs yet. Start exploring opportunities!
              </p>
              <Link to="/jobs">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                  Browse Jobs
                </button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyApplications;

