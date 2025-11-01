import { Router } from "express";
import {
  getAllMatches,
  getUserTopMatches,
  getCompatibilityStats,
} from "../controllers/matchController";

const router = Router();

router.get("/all", getAllMatches);
router.get("/stats", getCompatibilityStats);
router.get("/user/:id", getUserTopMatches);

export default router;

