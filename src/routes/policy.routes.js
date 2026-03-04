import express from "express";
import {
  createPolicy,
  getPolicies
} from "../controllers/policy.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * Create policy
 * ADMIN, AGENT
 */
router.post("/", protect(["ADMIN", "AGENT"]), createPolicy);

/**
 * Get policies
 * ADMIN → all
 * AGENT → own
 */
router.get("/", protect(["ADMIN", "AGENT"]), getPolicies);

export default router;
