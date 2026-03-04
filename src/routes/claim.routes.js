import express from "express";
import {
  createClaim,
  getClaims,
  updateClaimStatus
} from "../controllers/claim.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create claim
router.post("/", protect(["ADMIN", "AGENT"]), createClaim);

// Get claims
router.get("/", protect(["ADMIN", "AGENT"]), getClaims);

// Update status
router.patch("/:id/status", protect(["ADMIN", "AGENT"]), updateClaimStatus);

export default router;