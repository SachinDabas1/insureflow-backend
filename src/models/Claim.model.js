import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    claimNumber: {
      type: String,
      required: true,
      unique: true
    },
    policy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: true
    },
    claimAmount: {
      type: Number,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "SETTLED"],
      default: "PENDING"
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Claim", claimSchema);