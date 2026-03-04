import Claim from "../models/claim.model.js";
import Policy from "../models/policy.model.js";

/**
 * Create claim
 * CUSTOMER / AGENT
 */
export const createClaim = async (req, res, next) => {
  try {
    const { claimNumber, policyId, claimAmount, reason, customerId } = req.body;

    if (!claimNumber || !policyId || !claimAmount || !reason || !customerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const policy = await Policy.findById(policyId);
    if (!policy) {
      return res.status(404).json({ message: "Policy not found" });
    }

    const claim = await Claim.create({
      claimNumber,
      policy: policyId,
      claimAmount,
      reason,
      raisedBy: customerId
    });

    res.status(201).json(claim);
  } catch (err) {
    next(err);
  }
};

/**
 * Get claims
 * ADMIN / AGENT
 */
export const getClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find()
      .populate("policy", "policyNumber policyType")
      .populate("raisedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (err) {
    next(err);
  }
};

/**
 * Update claim status
 * ADMIN / AGENT
 */
export const updateClaimStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    claim.status = status;
    await claim.save();

    res.json(claim);
  } catch (err) {
    next(err);
  }
};