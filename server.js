import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// Load cron jobs (must be imported once)
import "./src/cron/policyRenewal.cron.js";

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});