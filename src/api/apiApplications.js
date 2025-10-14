import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Hook to get applications by user
export const useGetApplicationsByUser = (socialId) => {
  return useQuery(api.applications.getApplicationsByUser, 
    socialId ? { socialId } : "skip"
  );
};

// Hook to get applications by job
export const useGetApplicationsByJob = (jobId) => {
  return useQuery(api.applications.getApplicationsByJob, 
    jobId ? { jobId } : "skip"
  );
};

// Hook to check if user has applied to a job
export const useHasUserApplied = (socialId, jobId) => {
  return useQuery(api.applications.hasUserApplied, 
    socialId && jobId ? { socialId, jobId } : "skip"
  );
};

// Hook to create application
export const useCreateApplication = () => {
  return useMutation(api.applications.createApplication);
};

// Hook to update application status
export const useUpdateApplicationStatus = () => {
  return useMutation(api.applications.updateApplicationStatus);
};
