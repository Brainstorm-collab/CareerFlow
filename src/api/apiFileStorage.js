import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

// Hook to generate upload URL
export const useGenerateUploadUrl = () => {
  return useMutation(api.fileStorage.generateUploadUrl);
};

// Hook to update file URL after upload
export const useUpdateFileUrl = () => {
  return useMutation(api.fileStorage.updateFileUrl);
};

// Hook to get file by ID
export const useGetFile = (fileId) => {
  return useQuery(api.fileStorage.getFile, fileId ? { fileId } : "skip");
};

// Hook to get files by user
export const useGetFilesByUser = (socialId) => {
  return useQuery(api.fileStorage.getFilesByUser, socialId ? { socialId } : "skip");
};

// Hook to delete file
export const useDeleteFile = () => {
  return useMutation(api.fileStorage.deleteFile);
};

// Hook to upload resume and update user profile
export const useUploadResumeAndUpdateProfile = () => {
  return useMutation(api.fileStorage.uploadResumeAndUpdateProfile);
};