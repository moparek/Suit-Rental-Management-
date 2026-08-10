const Customer = require("../Models/customerModel");


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
    const { name, phone, email, address, status } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Customer name and phone number are required" });
    }

    const customer = await Customer.create({
      name,
      phone,
      email,
      address,
      status: status || "active",
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, status } = req.body;
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (email !== undefined) customer.email = email;
    if (address !== undefined) customer.address = address;
    if (status) customer.status = status;

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    console.error("Update customer error:", error);
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

module.exports = {getCustomers,getCustomer,createCustomer,updateCustomer,deleteCustomer};
