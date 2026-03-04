import Policy from "../models/Policy.model.js";
import Customer from "../models/Customer.model.js";

/**
 * @desc   Create policy
 * @access ADMIN, AGENT
 */
export const createPolicy = async (req, res, next) => {
  try {
    const {
      policyNumber,
      policyType,
      premiumAmount,
      startDate,
      endDate,
      customerId
    } = req.body;

    if (
      !policyNumber ||
      !policyType ||
      !premiumAmount ||
      !startDate ||
      !endDate ||
      !customerId
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const policy = await Policy.create({
      policyNumber,
      policyType,
      premiumAmount,
      startDate,
      endDate,
      customer: customerId,
      issuedBy: req.user.id
    });

    res.status(201).json(policy);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get policies
 * @access ADMIN → all, AGENT → own
 */
export const getPolicies = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === "AGENT") {
      query.issuedBy = req.user.id;
    }

    const policies = await Policy.find(query)
      .populate("customer", "name email phone")
      .populate("issuedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(policies);
  } catch (err) {
    next(err);
  }
};
