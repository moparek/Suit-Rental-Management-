const Customer = require("../Models/customerModel");

const normalizeIdType = (idType) => {
  if (!idType) return null;
  const normalized = String(idType).toLowerCase().replace(/\s+/g, "");
  if (normalized === "nationalid" || normalized === "national_id") return "nationalId";
  if (normalized === "passport") return "passport";
  return null;
};

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error("Get customers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    console.error("Get customer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { phone, email, address, status } = req.body;
    const name = req.body.name || req.body.fullName;
    const idType = normalizeIdType(req.body.idType);

    if (!name || !phone) {
      return res.status(400).json({ message: "Customer name and phone number are required" });
    }

    if (!idType) {
      return res.status(400).json({ message: "ID type is required" });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      address,
      idType,
      status: status || "active",
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Create customer error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((e) => e.message).join(", ") });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { phone, email, address, status } = req.body;
    const name = req.body.name || req.body.fullName;
    const idType = normalizeIdType(req.body.idType);
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (email !== undefined) customer.email = email;
    if (address !== undefined) customer.address = address;
    if (status) customer.status = status;
    if (idType) customer.idType = idType;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    console.error("Update customer error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((e) => e.message).join(", ") });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer removed successfully", _id: req.params.id });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCustomerHistory = async (req, res) => {
  try {
    const Rental = require("../Models/rentalModel");
    const Booking = require("../Models/bookingModel");

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const rentals = await Rental.find({ customer: req.params.id })
      .populate("suit", "name category size color rentalPrice dailyRate image")
      .sort({ createdAt: -1 });

    const customerName = customer.name || customer.fullName || "";
    const bookings = await Booking.find({
      $or: [
        { customer: req.params.id },
        { phone: customer.phone },
        ...(customerName ? [{ customerName }] : []),
      ],
    })
      .populate("suit", "name category size color rentalPrice dailyRate image")
      .sort({ createdAt: -1 });

    res.json({
      customer,
      rentals,
      bookings,
    });
  } catch (error) {
    console.error("Get customer history error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  getCustomerHistory,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
