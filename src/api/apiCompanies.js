import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Hook to get companies
export const useGetCompanies = (filters = {}) => {
  return useQuery(api.companies.getCompanies, filters);
};

// Hook to get a single company
export const useGetCompany = (companyId) => {
  return useQuery(api.companies.getCompany, companyId ? { companyId } : "skip");
};

// Hook to get company by slug
export const useGetCompanyBySlug = (slug) => {
  return useQuery(api.companies.getCompanyBySlug, slug ? { slug } : "skip");
};

// Hook to get companies by creator
export const useGetCompaniesByCreator = (createdBy) => {
  return useQuery(api.companies.getCompaniesByCreator, createdBy ? { createdBy } : "skip");
};

// Hook to create a company
export const useCreateCompany = () => {
  return useMutation(api.companies.createCompany);
};

// Hook to update a company
export const useUpdateCompany = () => {
  return useMutation(api.companies.updateCompany);
};

// Hook to delete a company
export const useDeleteCompany = () => {
  return useMutation(api.companies.deleteCompany);
};

// Legacy API functions for backward compatibility
export async function getCompanies(token) {
  console.log('getCompanies called - use useGetCompanies hook instead');
  return [];
}

export async function getCompany(token, companyId) {
  console.log('getCompany called - use useGetCompany hook instead');
  return null;
}

export async function createCompany(token, companyData) {
  console.log('createCompany called - use useCreateCompany hook instead');
  return { success: false };
}

export async function updateCompany(token, companyId, companyData) {
  console.log('updateCompany called - use useUpdateCompany hook instead');
  return { success: false };
}

export async function uploadCompanyLogo(token, file, companyId) {
  console.log('uploadCompanyLogo called - use useGenerateUploadUrl hook instead');
  return { success: false, url: null };
}

export async function uploadCompanyCoverImage(token, file, companyId) {
  console.log('uploadCompanyCoverImage called - use useGenerateUploadUrl hook instead');
  return { success: false, url: null };
}