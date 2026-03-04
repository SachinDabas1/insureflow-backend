import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    policyNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    policyType: {
      type: String,
      enum: ["HEALTH", "MOTOR", "LIFE"],
      required: true
    },

    premiumAmount: {
      type: Number,
      required: true,
      min: 0
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED"],
      default: "ACTIVE"
    },

    // 🔁 Renewal-related fields
    isRenewed: {
      type: Boolean,
      default: false
    },

    renewalReminderSent: {
      type: Boolean,
      default: false
    },

    // 🔗 Relations
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Policy", policySchema);