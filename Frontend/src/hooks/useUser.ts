/**
 * React Query hooks for user data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCurrentUser,
  createUser,
  updateUser,
  syncUserWithBackend,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  getCurrentUserId,
} from '@/services/userService';
import { matchKeys } from './useMatches';

/**
 * Query key factory for users
 */
export const userKeys = {
  all: ['users'] as const,
  current: ['users', 'current'] as const,
  detail: (userId: number) => ['users', userId] as const,
};

/**
 * Hook to fetch current user
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.current,
    queryFn: getCurrentUser,
    staleTime: 60000, // Consider data stale after 1 minute
    retry: 1,
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateUserRequest) => createUser(userData),
    onSuccess: (response) => {
      // Invalidate and refetch user queries
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.setQueryData(userKeys.current, response.user);
      
      // Invalidate matches since new user might affect matching
      queryClient.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}

/**
 * Hook to update user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, userData }: { userId: number; userData: UpdateUserRequest }) =>
      updateUser(userId, userData),
    onSuccess: (response) => {
      const userId = response.user.id;
      
      // Update current user cache
      queryClient.setQueryData(userKeys.current, response.user);
      queryClient.setQueryData(userKeys.detail(userId), response.user);
      
      // Invalidate matches since preferences might have changed
      queryClient.invalidateQueries({ queryKey: matchKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: matchKeys.all });
    },
  });
}

/**
 * Hook to sync localStorage with backend
 */
export function useSyncUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: syncUserWithBackend,
    onSuccess: (user) => {
      if (user) {
        // Update user cache
        queryClient.setQueryData(userKeys.current, user);
        queryClient.setQueryData(userKeys.detail(user.id), user);
        
        // Mark preferences as updated
        localStorage.setItem('preferences_last_updated', Date.now().toString());
        
        // Invalidate matches to trigger recalculation
        queryClient.invalidateQueries({ queryKey: matchKeys.user(user.id) });
      }
    },
  });
}

