import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Hook to get jobs with filtering
export const useGetJobs = (filters = {}) => {
  return useQuery(api.jobs.getJobs, filters);
};

// Hook to get a single job
export const useGetJob = (jobId) => {
  const shouldSkip = !jobId || jobId === "undefined";
  return useQuery(api.jobs.getJob, shouldSkip ? "skip" : { jobId });
};

// Hook to get jobs by recruiter
export const useGetJobsByRecruiter = (recruiterId) => {
  return useQuery(api.jobs.getJobsByRecruiter, recruiterId ? { recruiterId } : "skip");
};

// Hook to create a job
export const useCreateJob = () => {
  return useMutation(api.jobs.createJob);
};

// Hook to update a job
export const useUpdateJob = () => {
  return useMutation(api.jobs.updateJob);
};

// Hook to delete a job
export const useDeleteJob = () => {
  return useMutation(api.jobs.deleteJob);
};

// Hook to create real jobs for testing
export const useCreateRealJobs = () => {
  return useMutation(api.jobs.createRealJobs);
};

// Hook to increment view count
export const useIncrementViewCount = () => {
  return useMutation(api.jobs.incrementViewCount);
};

// Legacy API functions for backward compatibility
export async function getJobs(token, { location, company_id, searchQuery, job_type, experience_level, salary_min, remote_work, limit = 20, offset = 0 }) {
  console.log('getJobs called - use useGetJobs hook instead');
  return [];
}

export async function getSingleJob(token, { job_id }) {
  console.log('getSingleJob called - use useGetJob hook instead');
  return null;
}

export async function getSavedJobs(token) {
  console.log('getSavedJobs called - use useGetSavedJobs hook instead');
  return [];
}

export async function saveJob(token, { alreadySaved }, saveData) {
  console.log('saveJob called - use useToggleSaveJob hook instead');
  return { success: false };
}

export async function createJob(token, jobData) {
  console.log('createJob called - use useCreateJob hook instead');
  return { success: false };
}

export async function updateJob(token, jobId, jobData) {
  console.log('updateJob called - use useUpdateJob hook instead');
  return { success: false };
}

export async function deleteJob(token, jobId) {
  console.log('deleteJob called - use useDeleteJob hook instead');
  return { success: false };
}

export async function getMyJobs(token) {
  console.log('getMyJobs called - use useGetJobsByRecruiter hook instead');
  return [];
}

export async function updateHiringStatus(token, jobId, status) {
  console.log('updateHiringStatus called - use useUpdateJob hook instead');
  return { success: false };
}