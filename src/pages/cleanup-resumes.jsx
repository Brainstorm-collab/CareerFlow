import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle, AlertCircle, Loader2, Database, Trash2 } from 'lucide-react';

const CleanupResumes = () => {
  const { user } = useAuth();
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanupResult, setCleanupResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCleaningApps, setIsCleaningApps] = useState(false);
  const [appCleanupResult, setAppCleanupResult] = useState(null);
  const [appError, setAppError] = useState(null);
  const [isCreatingJobs, setIsCreatingJobs] = useState(false);
  const [jobsResult, setJobsResult] = useState(null);
  const [jobsError, setJobsError] = useState(null);

  const cleanupDuplicateFiles = useMutation(api.fileStorage.cleanupDuplicateFiles);
  const cleanupInvalidApplications = useMutation(api.applications.cleanupInvalidApplications);
  const createRealJobs = useMutation(api.jobs.createRealJobs);

  const handleCleanup = async () => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    setIsCleaning(true);
    setError(null);
    setCleanupResult(null);

    try {
      const result = await cleanupDuplicateFiles({ socialId: user.id });
      setCleanupResult(result);
    } catch (err) {
      console.error('Cleanup error:', err);
      setError(err.message || 'Failed to cleanup duplicate files');
    } finally {
      setIsCleaning(false);
    }
  };

  const handleCleanupInvalidApplications = async () => {
    setIsCleaningApps(true);
    setAppError(null);
    setAppCleanupResult(null);

    try {
      const result = await cleanupInvalidApplications({});
      setAppCleanupResult(result);
    } catch (err) {
      console.error('Application cleanup error:', err);
      setAppError(err.message || 'Failed to cleanup invalid applications');
    } finally {
      setIsCleaningApps(false);
    }
  };

  const handleCreateRealJobs = async () => {
    setIsCreatingJobs(true);
    setJobsError(null);
    setJobsResult(null);

    try {
      const result = await createRealJobs({});
      setJobsResult(result);
    } catch (err) {
      console.error('Create jobs error:', err);
      setJobsError(err.message || 'Failed to create real jobs');
    } finally {
      setIsCreatingJobs(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Floating Blur Effects */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
              Database Cleanup Tools
            </h1>
            <p className="text-gray-300 text-lg">
              Clean up duplicate files and invalid application data
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
                Resume Cleanup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">What this does:</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Finds all your uploaded resume files</li>
                  <li>• Identifies files with the same name (case-insensitive)</li>
                  <li>• Keeps only the newest version of each file</li>
                  <li>• Deletes older duplicate files from storage</li>
                </ul>
              </div>

              {cleanupResult && (
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Cleanup Complete!</span>
                  </div>
                  <p className="text-gray-300 mt-2">
                    {cleanupResult.message}
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-300">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Error</span>
                  </div>
                  <p className="text-gray-300 mt-2">{error}</p>
                </div>
              )}

              <Button
                onClick={handleCleanup}
                disabled={isCleaning}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isCleaning ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Cleaning up files...
                  </>
                ) : (
                  'Cleanup Duplicate Files'
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  This action cannot be undone. Make sure you have backups if needed.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Invalid Applications Cleanup Card */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 shadow-2xl mt-6">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Database className="w-6 h-6 text-red-400" />
                Invalid Applications Cleanup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                <h3 className="text-red-300 font-semibold mb-2">What this does:</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Finds applications with invalid job or candidate IDs</li>
                  <li>• Removes applications with IDs that are not 27 characters long</li>
                  <li>• Fixes "Invalid ID length" errors in the application</li>
                  <li>• Cleans up corrupted application data</li>
                </ul>
              </div>

              {appCleanupResult && (
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Application Cleanup Complete!</span>
                  </div>
                  <p className="text-gray-300 mt-2">
                    {appCleanupResult.message}
                  </p>
                  <div className="mt-2 text-sm text-gray-400">
                    <p>Valid applications: {appCleanupResult.validApplications}</p>
                    <p>Invalid applications removed: {appCleanupResult.invalidApplicationsRemoved}</p>
                  </div>
                </div>
              )}

              {appError && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-300">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Error</span>
                  </div>
                  <p className="text-gray-300 mt-2">{appError}</p>
                </div>
              )}

              <Button
                onClick={handleCleanupInvalidApplications}
                disabled={isCleaningApps}
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isCleaningApps ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Cleaning up applications...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5 mr-2" />
                    Cleanup Invalid Applications
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  This will permanently remove applications with invalid IDs. Use this to fix database errors.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Create Real Jobs Card */}
          <Card className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-white/20 shadow-2xl mt-6">
            <CardHeader>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Database className="w-6 h-6 text-green-400" />
                Create Real Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                <h3 className="text-green-300 font-semibold mb-2">What this does:</h3>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Creates real companies (Google, Microsoft, Amazon) in the database</li>
                  <li>• Creates real job postings with proper Convex IDs</li>
                  <li>• Allows you to apply to real jobs and see real data</li>
                  <li>• Replaces sample jobs with actual database entries</li>
                </ul>
              </div>

              {jobsResult && (
                <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Real Jobs Created Successfully!</span>
                  </div>
                  <p className="text-gray-300 mt-2">
                    {jobsResult.message}
                  </p>
                  <div className="mt-2 text-sm text-gray-400">
                    <p>Companies created: {jobsResult.data?.companyIds?.length || 0}</p>
                    <p>Jobs created: {jobsResult.data?.jobIds?.length || 0}</p>
                  </div>
                </div>
              )}

              {jobsError && (
                <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-300">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold">Error</span>
                  </div>
                  <p className="text-gray-300 mt-2">{jobsError}</p>
                </div>
              )}

              <Button
                onClick={handleCreateRealJobs}
                disabled={isCreatingJobs}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isCreatingJobs ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating real jobs...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5 mr-2" />
                    Create Real Jobs
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  This will create real companies and jobs in your database. You can then apply to these jobs and see real data in your applications.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CleanupResumes;
