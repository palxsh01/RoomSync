import { hungarianAlgorithm, calculateAssignmentCost } from "../algorithms/hungarian";
import { 
  buildCostMatrix, 
  calculateCompatibility,
  UserPreferences 
} from "../algorithms/compatibility";
import { User, userDatabase } from "../models/User";

export interface MatchResult {
  userId: number;
  matchedWithId: number;
  compatibility: number;
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

export interface MatchingSummary {
  totalCost: number;
  averageCompatibility: number;
  matches: MatchResult[];
  unmatched: number[];
}

/**
 * Find optimal roommate matches using Hungarian algorithm
 * Returns matches along with compatibility scores
 */
export function findOptimalMatches(users: User[]): MatchingSummary {
  if (users.length < 2) {
    return {
      totalCost: 0,
      averageCompatibility: 0,
      matches: [],
      unmatched: users.map((u) => u.id),
    };
  }

  // Build cost matrix
  const costMatrix = buildCostMatrix(users);

  // Run Hungarian algorithm
  const assignments = hungarianAlgorithm(costMatrix);

  // Calculate results
  const matches: MatchResult[] = [];
  const matchedUserIds = new Set<number>();

  for (const [userIdx, roommateIdx] of assignments) {
    const user = users[userIdx];
    const roommate = users[roommateIdx];
    
    if (user && roommate) {
      const compatibilityResult = calculateCompatibility(user.preferences, roommate.preferences);
      
      matches.push({
        userId: user.id,
        matchedWithId: roommate.id,
        compatibility: compatibilityResult.percentage,
        breakdown: compatibilityResult.breakdown,
      });

      matchedUserIds.add(user.id);
      matchedUserIds.add(roommate.id);
    }
  }

  // Find unmatched users
  const unmatched = users
    .filter((user) => !matchedUserIds.has(user.id))
    .map((user) => user.id);

  // Calculate total cost and average compatibility
  const totalCost = calculateAssignmentCost(costMatrix, assignments);
  const averageCompatibility = matches.length > 0
    ? Math.round(matches.reduce((sum, match) => sum + match.compatibility, 0) / matches.length)
    : 0;

  return {
    totalCost,
    averageCompatibility,
    matches,
    unmatched,
  };
}

/**
 * Find matches for all users in the database
 */
export function findAllMatches(): MatchingSummary {
  const users = userDatabase.getAll();
  return findOptimalMatches(users);
}

/**
 * Find matches for a specific user
 */
export function findUserMatches(userId: number): MatchResult[] {
  const user = userDatabase.getById(userId);
  if (!user) {
    return [];
  }

  const allUsers = userDatabase.getAll();
  const otherUsers = allUsers.filter((u) => u.id !== userId);
  
  if (otherUsers.length === 0) {
    return [];
  }

  // Calculate compatibility with each other user
  const matches: MatchResult[] = otherUsers.map((otherUser) => {
    const compatibilityResult = calculateCompatibility(user.preferences, otherUser.preferences);
    
    return {
      userId: user.id,
      matchedWithId: otherUser.id,
      compatibility: compatibilityResult.percentage,
      breakdown: compatibilityResult.breakdown,
    };
  });

  // Sort by compatibility (highest first)
  matches.sort((a, b) => b.compatibility - a.compatibility);

  return matches;
}

/**
 * Get top N matches for a specific user
 */
export function findTopMatches(userId: number, limit: number = 10): MatchResult[] {
  const matches = findUserMatches(userId);
  return matches.slice(0, limit);
}

