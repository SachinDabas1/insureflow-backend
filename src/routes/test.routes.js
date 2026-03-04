import express from "express";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get(
  "/secure",
  protect(["ADMIN", "AGENT"]),
  (req, res) => {
    res.json({
      message: "You have accessed a protected route",
      user: req.user
    });
  }
);

export default router;
