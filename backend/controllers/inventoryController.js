const mongoose = require("mongoose");
const Inventory = require("../Models/inventory");
//add
const addInventory = async (req, res) => {
  try {
    const { name, zise, color, price, status, image } = req.body;

    if (!name || !zise || !color || !price || !status || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newInventory = new Inventory({ name, zise, color, price, status, image });
    const result = await newInventory.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding inventory:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};
//get all
const getAllinventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//Get Available 
const getAvailableInventory = async (req, res) => {
  try {
    const available = await Inventory.find({ status: "available" });
    res.json(available);
  } catch (error) {
    console.error("Error fetching available inventory:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//Get Single Inventory Item 
const findByid = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid inventory id" });
    }

    const result = await Inventory.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error finding inventory item:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//Update Inventory
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid inventory id" });
    }

    const { name, zise, color, price, status, image } = req.body;

    const updateData = { name, zise, color, price, status, image };

    const result = await Inventory.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//Delete Inventory
const deleteInventory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid inventory id" });
    }

    const result = await Inventory.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const [total, available, rented, maintenance] = await Promise.all([
      Inventory.countDocuments(),
      Inventory.countDocuments({ status: "available" }),
      Inventory.countDocuments({ status: "rental" }),
      Inventory.countDocuments({ status: "maintenance" }),
    ]);

    res.json({total, available, rented,maintenance});
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

module.exports = {addInventory,getAllinventory, getAvailableInventory, findByid,updateInventory,deleteInventory,
  getDashboardStats};
