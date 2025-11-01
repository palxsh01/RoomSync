/**
 * Compatibility scoring algorithm for roommate matching
 * Converts user preferences into compatibility scores
 */

export interface UserPreferences {
  cleanliness: string;
  sleep_schedule: string;
  noise_tolerance: string;
  guests: string;
  lifestyle: string;
  study_work: string;
  ac_preference: string;
  roommate_count: string;
}

export interface CompatibilityScore {
  total: number;
  percentage: number;
  breakdown: {
    cleanliness: number;
    sleep_schedule: number;
    noise_tolerance: number;
    guests: number;
    lifestyle: number;
    study_work: number;
    ac_preference: number;
  };
}

/**
 * Calculate compatibility score between two users
 * Returns a score from 0 to 100 where 100 is perfect match
 */
export function calculateCompatibility(
  user1: UserPreferences,
  user2: UserPreferences
): CompatibilityScore {
  const breakdown = {
    cleanliness: scoreCleanliness(user1.cleanliness, user2.cleanliness),
    sleep_schedule: scoreSleepSchedule(user1.sleep_schedule, user2.sleep_schedule),
    noise_tolerance: scoreNoiseTolerance(user1.noise_tolerance, user2.noise_tolerance),
    guests: scoreGuests(user1.guests, user2.guests),
    lifestyle: scoreLifestyle(user1.lifestyle, user2.lifestyle),
    study_work: scoreStudyWork(user1.study_work, user2.study_work),
    ac_preference: scoreACPreference(user1.ac_preference, user2.ac_preference),
  };

  const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0);
  const percentage = Math.round((total / (Object.keys(breakdown).length * 100)) * 100);

  return {
    total,
    percentage,
    breakdown,
  };
}

/**
 * Score cleanliness compatibility (0-100)
 */
function scoreCleanliness(c1: string, c2: string): number {
  const scores: Record<string, Record<string, number>> = {
    "Very tidy": {
      "Very tidy": 100,
      "Moderately clean": 80,
      "Relaxed about mess": 40,
      "Prefer organized chaos": 50,
    },
    "Moderately clean": {
      "Very tidy": 80,
      "Moderately clean": 100,
      "Relaxed about mess": 70,
      "Prefer organized chaos": 60,
    },
    "Relaxed about mess": {
      "Very tidy": 40,
      "Moderately clean": 70,
      "Relaxed about mess": 100,
      "Prefer organized chaos": 80,
    },
    "Prefer organized chaos": {
      "Very tidy": 50,
      "Moderately clean": 60,
      "Relaxed about mess": 80,
      "Prefer organized chaos": 100,
    },
  };
  return scores[c1]?.[c2] || 50;
}

/**
 * Score sleep schedule compatibility (0-100)
 */
function scoreSleepSchedule(s1: string, s2: string): number {
  const scores: Record<string, Record<string, number>> = {
    "Early bird (before 10 PM)": {
      "Early bird (before 10 PM)": 100,
      "Night owl (after midnight)": 30,
      "Flexible": 85,
      "Irregular schedule": 60,
    },
    "Night owl (after midnight)": {
      "Early bird (before 10 PM)": 30,
      "Night owl (after midnight)": 100,
      "Flexible": 85,
      "Irregular schedule": 60,
    },
    "Flexible": {
      "Early bird (before 10 PM)": 85,
      "Night owl (after midnight)": 85,
      "Flexible": 100,
      "Irregular schedule": 80,
    },
    "Irregular schedule": {
      "Early bird (before 10 PM)": 60,
      "Night owl (after midnight)": 60,
      "Flexible": 80,
      "Irregular schedule": 100,
    },
  };
  return scores[s1]?.[s2] || 50;
}

/**
 * Score noise tolerance compatibility (0-100)
 */
function scoreNoiseTolerance(n1: string, n2: string): number {
  const scores: Record<string, Record<string, number>> = {
    "Prefer quiet environment": {
      "Prefer quiet environment": 100,
      "Moderate noise is fine": 70,
      "Don't mind louder spaces": 40,
      "Music/TV lover": 20,
    },
    "Moderate noise is fine": {
      "Prefer quiet environment": 70,
      "Moderate noise is fine": 100,
      "Don't mind louder spaces": 80,
      "Music/TV lover": 50,
    },
    "Don't mind louder spaces": {
      "Prefer quiet environment": 40,
      "Moderate noise is fine": 80,
      "Don't mind louder spaces": 100,
      "Music/TV lover": 90,
    },
    "Music/TV lover": {
      "Prefer quiet environment": 20,
      "Moderate noise is fine": 50,
      "Don't mind louder spaces": 90,
      "Music/TV lover": 100,
    },
  };
  return scores[n1]?.[n2] || 50;
}

/**
 * Score guests compatibility (0-100)
 */
function scoreGuests(g1: string, g2: string): number {
  const scores: Record<string, Record<string, number>> = {
    "Rarely": {
      "Rarely": 100,
      "Occasionally (1-2 times/month)": 80,
      "Frequently (weekly)": 50,
      "Very often": 30,
    },
    "Occasionally (1-2 times/month)": {
      "Rarely": 80,
      "Occasionally (1-2 times/month)": 100,
      "Frequently (weekly)": 80,
      "Very often": 50,
    },
    "Frequently (weekly)": {
      "Rarely": 50,
      "Occasionally (1-2 times/month)": 80,
      "Frequently (weekly)": 100,
      "Very often": 85,
    },
    "Very often": {
      "Rarely": 30,
      "Occasionally (1-2 times/month)": 50,
      "Frequently (weekly)": 85,
      "Very often": 100,
    },
  };
  return scores[g1]?.[g2] || 50;
}

/**
 * Score lifestyle compatibility (0-100)
 */
function scoreLifestyle(l1: string, l2: string): number {
  const scores: Record<string, Record<string, number>> = {
    "Homebody": {
      "Homebody": 100,
      "Social butterfly": 50,
      "Balanced": 80,
      "Always out": 30,
    },
    "Social butterfly": {
      "Homebody": 50,
      "Social butterfly": 100,
      "Balanced": 80,
      "Always out": 85,
    },
    "Balanced": {
      "Homebody": 80,
      "Social butterfly": 80,
      "Balanced": 100,
      "Always out": 70,
    },
    "Always out": {
      "Homebody": 30,
      "Social butterfly": 85,
      "Balanced": 70,
      "Always out": 100,
    },
  };
  return scores[l1]?.[l2] || 50;
}

/**
 * Score study/work time compatibility (0-100)
 */
function scoreStudyWork(s1: string, s2: string): number {
  const scores: Record<string, Record<string, number>> = {
    "Morning person": {
      "Morning person": 100,
      "Afternoon": 70,
      "Evening": 60,
      "Night shifts": 30,
    },
    "Afternoon": {
      "Morning person": 70,
      "Afternoon": 100,
      "Evening": 80,
      "Night shifts": 50,
    },
    "Evening": {
      "Morning person": 60,
      "Afternoon": 80,
      "Evening": 100,
      "Night shifts": 70,
    },
    "Night shifts": {
      "Morning person": 30,
      "Afternoon": 50,
      "Evening": 70,
      "Night shifts": 100,
    },
  };
  return scores[s1]?.[s2] || 50;
}

/**
 * Score AC preference compatibility (0-100)
 */
function scoreACPreference(a1: string, a2: string): number {
  const scores: Record<string, Record<string, number>> = {
    "Cool (below 68°F)": {
      "Cool (below 68°F)": 100,
      "Moderate (68-72°F)": 70,
      "Warm (above 72°F)": 40,
      "No preference": 80,
    },
    "Moderate (68-72°F)": {
      "Cool (below 68°F)": 70,
      "Moderate (68-72°F)": 100,
      "Warm (above 72°F)": 70,
      "No preference": 90,
    },
    "Warm (above 72°F)": {
      "Cool (below 68°F)": 40,
      "Moderate (68-72°F)": 70,
      "Warm (above 72°F)": 100,
      "No preference": 80,
    },
    "No preference": {
      "Cool (below 68°F)": 80,
      "Moderate (68-72°F)": 90,
      "Warm (above 72°F)": 80,
      "No preference": 100,
    },
  };
  return scores[a1]?.[a2] || 50;
}

/**
 * Convert compatibility score to cost for Hungarian algorithm
 * Lower compatibility score should result in higher cost
 */
export function compatibilityToCost(compatibilityScore: number): number {
  // Invert: 100% compatibility = 0 cost, 0% compatibility = 100 cost
  return 100 - compatibilityScore;
}

/**
 * Build cost matrix for Hungarian algorithm
 * Each row is a user, each column is a potential roommate
 */
export function buildCostMatrix(
  users: Array<{ id: number; preferences: UserPreferences }>
): number[][] {
  const n = users.length;
  const costMatrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        // Can't be roommates with themselves
        row.push(Infinity);
      } else {
        const score = calculateCompatibility(users[i].preferences, users[j].preferences);
        row.push(compatibilityToCost(score.percentage));
      }
    }
    costMatrix.push(row);
  }

  return costMatrix;
}

