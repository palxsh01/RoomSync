/**
 * Match service for API interactions
 */

import { get } from '@/lib/api';

export interface CompatibilityBreakdown {
  cleanliness: number;
  sleep_schedule: number;
  noise_tolerance: number;
  guests: number;
  lifestyle: number;
  study_work: number;
  ac_preference: number;
}

export interface Match {
  userId: number;
  matchedWithId: number;
  compatibility: number;
  breakdown: CompatibilityBreakdown;
  matchedWithName?: string;
  matchedWithBio?: string;
}

export interface MatchesResponse {
  matches: Match[];
}

export interface MatchStats {
  totalUsers: number;
  totalMatches: number;
  averageCompatibility: number;
  unmatchedCount: number;
  totalCost: number;
}

/**
 * Get top matches for a user
 */
export async function getUserTopMatches(
  userId: number,
  limit: number = 10
): Promise<MatchesResponse> {
  return get<MatchesResponse>(`/matches/user/${userId}?limit=${limit}`);
}

/**
 * Get all matches (admin/statistics endpoint)
 */
export async function getAllMatches(): Promise<{
  matches: Match[];
  totalCost: number;
  averageCompatibility: number;
  unmatched: number[];
}> {
  return get<{
    matches: Match[];
    totalCost: number;
    averageCompatibility: number;
    unmatched: number[];
  }>('/matches/all');
}

/**
 * Get compatibility statistics
 */
export async function getCompatibilityStats(): Promise<MatchStats> {
  return get<MatchStats>('/matches/stats');
}

