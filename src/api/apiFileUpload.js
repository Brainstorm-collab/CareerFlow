import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Hook to get file uploads by user
export const useGetFileUploadsByUser = (uploadedBy) => {
  return useQuery(api.fileUploads.getFileUploadsByUser, uploadedBy ? { uploadedBy } : "skip");
};

// Hook to get a single file upload
export const useGetFileUpload = (fileUploadId) => {
  return useQuery(api.fileUploads.getFileUpload, fileUploadId ? { fileUploadId } : "skip");
};

// Hook to create file upload record
export const useCreateFileUpload = () => {
  return useMutation(api.fileUploads.createFileUpload);
};

// Hook to delete file upload record
export const useDeleteFileUpload = () => {
  return useMutation(api.fileUploads.deleteFileUpload);
};

// Hook to generate upload URL
export const useGenerateUploadUrl = () => {
  return useMutation(api.fileUploads.generateUploadUrl);
};

// Hook to get file URL
export const useGetFileUrl = () => {
  return useMutation(api.fileUploads.getFileUrl);
};

// Legacy API functions for backward compatibility
export async function uploadUserAvatar(token, file, userId) {
  console.log('uploadUserAvatar called - use useGenerateUploadUrl hook instead');
  return { success: false, url: null };
}

export async function uploadUserResume(token, file, userId) {
  console.log('uploadUserResume called - use useGenerateUploadUrl hook instead');
  return { success: false, url: null };
}

export function getFileUrl(bucketName, fileName) {
  console.log('getFileUrl called - use useGetFileUrl hook instead');
  return null;
}

export function getPrivateFileUrl(bucketName, fileName) {
  console.log('getPrivateFileUrl called - use useGetFileUrl hook instead');
  return null;
}

export function validateFile(file, allowedTypes, maxSize) {
  console.log('validateFile called - implement file validation');
  return { valid: false, error: 'Not implemented yet' };
}