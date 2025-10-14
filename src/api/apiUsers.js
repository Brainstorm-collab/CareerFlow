import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Hook to get user by email
export const useGetUserByEmail = (email) => {
  return useQuery(api.users.getUserByEmail, email ? { email } : "skip");
};

// Hook to get user by Social ID
export const useGetUser = (socialId) => {
  return useQuery(api.users.getUserBySocialId, socialId ? { socialId } : "skip");
};

// Hook to get users by role
export const useGetUsersByRole = (role) => {
  return useQuery(api.users.getUsersByRole, role ? { role } : "skip");
};

// Hook to create a user
export const useCreateUser = () => {
  return useMutation(api.users.createUser);
};

// Hook to update user
export const useUpdateUser = () => {
  return useMutation(api.users.updateUser);
};

// Hook to delete user
export const useDeleteUser = () => {
  return useMutation(api.users.deleteUser);
};

// Hook to sync user from auth provider
export const useSyncUser = () => {
  return useMutation(api.users.syncUser);
};

// Hook to manually update user role
export const useUpdateUserRole = () => {
  return useMutation(api.users.updateUserRole);
};

// Hook to run nameCustomized migration
export const useMigrateNameCustomized = () => {
  return useMutation(api.users.migrateNameCustomized);
};
