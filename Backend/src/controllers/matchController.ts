import { Request, Response } from "express";
import { findAllMatches, findTopMatches } from "../services/matchingService";
import { userDatabase } from "../models/User";

export const getAllMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = findAllMatches();
    
    // Enrich with user information
    const enrichedMatches = summary.matches.map((match) => {
      const user = userDatabase.getById(match.userId);
      const matchedUser = userDatabase.getById(match.matchedWithId);
      
      return {
        ...match,
        userName: user?.name,
        matchedWithName: matchedUser?.name,
        matchedWithBio: matchedUser?.about,
      };
    });

    res.json({
      totalCost: summary.totalCost,
      averageCompatibility: summary.averageCompatibility,
      matches: enrichedMatches,
      unmatched: summary.unmatched,
    });
  } catch (error) {
    console.error("Error getting matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserTopMatches = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit as string) || 10;

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const matches = findTopMatches(userId, limit);
    
    // Enrich with user information
    const enrichedMatches = matches.map((match) => {
      const matchedUser = userDatabase.getById(match.matchedWithId);
      
      return {
        ...match,
        matchedWithName: matchedUser?.name,
        matchedWithBio: matchedUser?.about,
      };
    });

    res.json({ matches: enrichedMatches });
  } catch (error) {
    console.error("Error getting user matches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCompatibilityStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const summary = findAllMatches();
    
    const stats = {
      totalUsers: userDatabase.getAll().length,
      totalMatches: summary.matches.length,
      averageCompatibility: summary.averageCompatibility,
      unmatchedCount: summary.unmatched.length,
      totalCost: summary.totalCost,
    };

    res.json(stats);
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

