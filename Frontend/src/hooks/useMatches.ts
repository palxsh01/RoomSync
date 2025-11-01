/**
 * React Query hooks for matches data with live updates
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserTopMatches, Match } from '@/services/matchService';
import { getCurrentUserId } from '@/services/userService';
import { useEffect } from 'react';

/**
 * Query key factory for matches
 */
export const matchKeys = {
  all: ['matches'] as const,
  user: (userId: number) => ['matches', 'user', userId] as const,
  top: (userId: number, limit: number) => ['matches', 'user', userId, 'top', limit] as const,
};

/**
 * Hook to fetch top matches for current user with live updates
 * 
 * @param limit - Number of top matches to fetch (default: 10)
 * @param pollInterval - Interval for polling updates in milliseconds (default: 30000 = 30 seconds)
 * @param enabled - Whether to enable the query (default: true)
 */
export function useMatches(
  limit: number = 10,
  pollInterval: number = 30000,
  enabled: boolean = true
) {
  const userId = getCurrentUserId();

  const query = useQuery({
    queryKey: matchKeys.top(userId || 0, limit),
    queryFn: async () => {
      if (!userId) {
        throw new Error('User not logged in');
      }
      const response = await getUserTopMatches(userId, limit);
      return response.matches;
    },
    enabled: enabled && !!userId,
    refetchInterval: pollInterval, // Poll for updates every pollInterval ms
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Refetch on component mount
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  return {
    matches: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}

/**
 * Hook to manually trigger match updates
 * Useful after user updates their preferences
 */
export function useInvalidateMatches() {
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();

  const invalidateMatches = () => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: matchKeys.user(userId) });
    }
  };

  return invalidateMatches;
}

/**
 * Hook with automatic refetch after preference updates
 */
export function useMatchesWithAutoRefresh(
  limit: number = 10,
  pollInterval: number = 30000
) {
  const matches = useMatches(limit, pollInterval);
  const queryClient = useQueryClient();
  const userId = getCurrentUserId();

  // Listen for preference updates in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      if (userId) {
        // Invalidate and refetch matches when preferences change
        queryClient.invalidateQueries({ queryKey: matchKeys.user(userId) });
      }
    };

    // Listen for storage events (from other tabs)
    window.addEventListener('storage', handleStorageChange);

    // Poll for localStorage changes (for same tab)
    const interval = setInterval(() => {
      const lastUpdate = localStorage.getItem('preferences_last_updated');
      const currentTime = Date.now().toString();
      
      if (lastUpdate && parseInt(lastUpdate) < Date.now() - 5000) {
        // Preferences were updated more than 5 seconds ago, refresh matches
        handleStorageChange();
        localStorage.setItem('preferences_last_updated', currentTime);
      }
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userId, queryClient]);

  return matches;
}

