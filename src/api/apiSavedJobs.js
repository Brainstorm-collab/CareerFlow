import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Hook to get saved jobs for a user
export const useGetSavedJobs = (socialId) => {
  return useQuery(api.savedJobs.getSavedJobs, socialId ? { socialId } : "skip");
};

// Hook to check if a job is saved
export const useIsJobSaved = (socialId, jobId) => {
  return useQuery(api.savedJobs.isJobSaved, 
    socialId && jobId && jobId !== "undefined" ? { socialId, jobId } : "skip"
  );
};

// Hook to save a job
export const useSaveJob = () => {
  return useMutation(api.savedJobs.saveJob);
};

// Hook to unsave a job
export const useUnsaveJob = () => {
  return useMutation(api.savedJobs.unsaveJob);
};

// Hook to toggle save status
export const useToggleSaveJob = () => {
  return useMutation(api.savedJobs.toggleSaveJob);
};
