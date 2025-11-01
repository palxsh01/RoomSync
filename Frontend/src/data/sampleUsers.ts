/**
 * Sample users for matching demonstration
 * These are the fake users that users can match against
 */

import { UserPreferences } from '@/utils/compatibility';

export interface SampleUser {
  id: number;
  name: string;
  bio: string;
  preferences: UserPreferences;
}

/**
 * Sample users with predefined preferences
 * Based on the original sample data from Matches.tsx
 */
export const SAMPLE_USERS: SampleUser[] = [
  {
    id: 1,
    name: "Utkersh Sharma",
    bio: "Computer Science major, loves reading and hiking",
    preferences: {
      cleanliness: "Very tidy",
      sleep_schedule: "Early bird (before 10 PM)",
      noise_tolerance: "Prefer quiet environment",
      guests: "Rarely",
      lifestyle: "Homebody",
      study_work: "Morning person",
      ac_preference: "Moderate",
      roommate_count: "1 roommate",
    },
  },
  {
    id: 2,
    name: "Rishita Khetan",
    bio: "Business student, enjoys cooking and playing guitar",
    preferences: {
      cleanliness: "Moderately clean",
      sleep_schedule: "Flexible",
      noise_tolerance: "Moderate noise is fine",
      guests: "Occasionally (1-2 times/month)",
      lifestyle: "Balanced",
      study_work: "Afternoon",
      ac_preference: "Moderate",
      roommate_count: "2 roommates",
    },
  },
  {
    id: 3,
    name: "Tanishka Saxena",
    bio: "Engineering student, passionate about sports and technology",
    preferences: {
      cleanliness: "Very tidy",
      sleep_schedule: "Night owl (after midnight)",
      noise_tolerance: "Prefer quiet environment",
      guests: "Rarely",
      lifestyle: "Balanced",
      study_work: "Evening",
      ac_preference: "Cool",
      roommate_count: "1 roommate",
    },
  },
];

