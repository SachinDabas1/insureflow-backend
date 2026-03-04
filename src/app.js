import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import testRoutes from "./routes/test.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import claimRoutes from "./routes/claim.routes.js";

import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:4200', 'https://insureflow-frontend.vercel.app'], credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/claims", claimRoutes);

// Error handler (always last)
app.use(errorHandler);

export default app;