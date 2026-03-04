import express from "express";
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  deleteCustomer
} from "../controllers/customer.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// AGENT & ADMIN
router.post("/", protect(["AGENT", "ADMIN"]), createCustomer);

// ADMIN → all, AGENT → own
router.get("/", protect(["ADMIN", "AGENT"]), getCustomers);

// ADMIN & AGENT (ownership check inside controller)
router.get("/:id", protect(["ADMIN", "AGENT"]), getCustomerById);

// ADMIN only
router.delete("/:id", protect(["ADMIN"]), deleteCustomer);

export default router;