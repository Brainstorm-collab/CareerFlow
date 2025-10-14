import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Hook to get applications by candidate
export const useGetApplicationsByCandidate = (socialId) => {
  return useQuery(api.applications.getApplicationsByUser, socialId ? { socialId } : "skip");
};

// Hook to get applications by job
export const useGetApplicationsByJob = (jobId) => {
  return useQuery(api.applications.getApplicationsByJob, jobId && jobId !== "undefined" ? { jobId } : "skip");
};

// Hook to get a single application (not implemented yet)
export const useGetApplication = (applicationId) => {
  return null; // Function not implemented in Convex yet
};

// Hook to create an application
export const useCreateApplication = () => {
  return useMutation(api.applications.createApplication);
};

// Hook to apply to a job (use createApplication instead)
export const useApplyToJob = () => {
  return useMutation(api.applications.createApplication);
};

// Hook to update application status
export const useUpdateApplicationStatus = () => {
  return useMutation(api.applications.updateApplicationStatus);
};

// Hook to withdraw/delete an application
export const useWithdrawApplication = () => {
  return useMutation(api.applications.withdrawApplication);
};

export const useCleanupInvalidApplications = () => {
  return useMutation(api.applications.cleanupInvalidApplications);
};

// Hook to create real jobs for testing
export const useCreateRealJobs = () => {
  return useMutation(api.seedData.createRealJobs);
};

// Hook to delete an application (use useWithdrawApplication instead)
export const useDeleteApplication = () => {
  return useMutation(api.applications.withdrawApplication);
};

// Legacy API functions for backward compatibility
export async function createApplication(token, applicationData) {
  console.log('createApplication called - use useCreateApplication hook instead');
  return { success: false };
}

export async function applyToJob(token, applicationData) {
  console.log('applyToJob called - use useApplyToJob hook instead');
  return { success: false };
}

export async function getJobApplications(token, jobId) {
  console.log('getJobApplications called - use useGetApplicationsByJob hook instead');
  return [];
}

export async function getApplications(token, jobId) {
  console.log('getApplications called - use useGetApplicationsByJob hook instead');
  return [];
}

export async function getMyApplications(token) {
  console.log('getMyApplications called - use useGetApplicationsByCandidate hook instead');
  return [];
}

export async function updateApplicationStatus(token, applicationId, status) {
  console.log('updateApplicationStatus called - use useUpdateApplicationStatus hook instead');
  return { success: false };
}

export async function uploadResume(token, file, userId) {
  console.log('uploadResume called - use useGenerateUploadUrl hook instead');
  return { success: false, url: null };
}