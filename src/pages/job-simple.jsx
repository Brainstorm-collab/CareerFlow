import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sampleJobs } from "@/data/sampleJobs";
import { useGetUser } from "@/api/apiUsers";

const JobPageSimple = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  // Get user role from database
  const databaseUser = useGetUser(user?.id);

  // Check if this is a sample job
  const isSampleJob = id && id.startsWith('k1734x8k');
  const sampleJob = isSampleJob ? sampleJobs.find(job => job._id === id) : null;

  console.log('JobPageSimple - ID:', id);
  console.log('JobPageSimple - isSampleJob:', isSampleJob);
  console.log('JobPageSimple - sampleJob:', sampleJob);

  // Handle case when no job ID is provided
  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Job ID Provided</h1>
          <p className="text-gray-300">Please navigate to a job from the job listing page.</p>
        </div>
      </div>
    );
  }

  // Handle case when sample job is not found
  if (isSampleJob && !sampleJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Sample Job Not Found</h1>
          <p className="text-gray-300">The requested sample job could not be found.</p>
        </div>
      </div>
    );
  }

  // Use sample job data
  const jobData = isSampleJob ? sampleJob : null;

  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Job Not Found</h1>
          <p className="text-gray-300">The job you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  console.log('JobPageSimple - Reached main content rendering!');

  return (
    <main className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Job Header */}
        <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="gradient-title font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tighter mb-4">
              {jobData.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span className="text-lg">{jobData.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span className="text-lg">{jobData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <span className="text-lg capitalize">{jobData.jobType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <h2 className="text-2xl font-bold text-white mb-6">Job Description</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed">
                  {jobData.description || "This is a sample job description. In a real application, this would contain detailed information about the role, responsibilities, and requirements."}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Job Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Company:</span>
                  <span className="text-white">{jobData.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{jobData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white capitalize">{jobData.jobType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Experience:</span>
                  <span className="text-white">{jobData.experienceLevel || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {/* Actions Section - Only for candidates */}
            {databaseUser?.role === 'candidate' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Apply Now
                  </button>
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Save Job
                  </button>
                </div>
              </div>
            )}

            {/* Recruiter Actions Section - Only for recruiters */}
            {databaseUser?.role === 'recruiter' && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Recruiter Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                    View Applicants
                  </button>
                  <button className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors">
                    Edit Job
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobPageSimple;
