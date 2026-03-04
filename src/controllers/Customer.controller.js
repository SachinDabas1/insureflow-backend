import Customer from "../models/Customer.model.js";

/**
 * @desc   Create customer
 * @access AGENT, ADMIN
 */
export const createCustomer = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      address,
      createdBy: req.user.id
    });

    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get customers (pagination + search)
 * @access ADMIN → all, AGENT → own customers
 * @query  page, limit, search
 */
export const getCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    let query = {};

    // Search by name, email, phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    // AGENT sees only own customers
    if (req.user.role === "AGENT") {
      query.createdBy = req.user.id;
    }

    const total = await Customer.countDocuments(query);

    const customers = await Customer.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      customers
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get single customer
 * @access ADMIN, AGENT (own customer only)
 */
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // AGENT can only view own customer
    if (
      req.user.role === "AGENT" &&
      customer.createdBy._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(customer);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Delete customer
 * @access ADMIN only
 */
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.deleteOne();

    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
};