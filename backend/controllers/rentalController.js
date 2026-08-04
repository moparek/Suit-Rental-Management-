const Rental = require("../Models/rental");
const mongoose = require("mongoose");

// Add Rental
const addRental = async (req, res) => {
  try {
    const body = req.body || {};
    const {name, phone, phoneTwo, deposit, startDate, endDate,paymentStatus } = body;
    if (!name || !phone || !phoneTwo || !startDate || !endDate) {
      return res.status(400).json({message: "All required fields are required"});
    }

    const newRental = new Rental({name, phone, phoneTwo, deposit, startDate, endDate,paymentStatus})
    const result = await newRental.save();
    res.status(201).json(result)
  } catch (error) {
    console.error("Internal server error occurred:", error);
    res.status(500).json({message: "Internal server error occurred"});
  }
};

// Get All Rentals
const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find();
    res.json(rentals);
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({message: "Internal server error occurred",
    });
  }
};

// Update Rental
const updateRental = async (req, res) => {
  try {
    const idRaw = req.params.id || "";
    const id = idRaw.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid rental id" });
    }
    
    const { name, phone, phoneTwo, deposit, startDate, endDate,paymentStatus } = req.body || {};

    const result = await Rental.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({message: "Rental not found"});
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating rental:", error);
    res.status(500).json({message: "Internal server error occurred"});
  }
};

// Delete Rental
const deleteRental = async (req, res) => {
  try {
    const idRaw = req.params.id || "";
    const id = idRaw.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid rental id" });
    }
    const result = await Rental.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({message: "Rental not found"});
    }
    res.json(result);
  } catch (error) {
    console.error("Error deleting rental:", error);
    res.status(500).json({message: "Internal server error occurred"});
  }
};

// Find Rental By ID
const findRentalById = async (req, res) => {
  try {
    const idRaw = req.params.id || "";
    const id = idRaw.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid rental id" });
    }
    const result = await Rental.findById(id);
    if (!result) {
      return res.status(404).json({message: "Rental not found"});
    }
    res.json(result);
  } catch (error) {
    console.error("Error finding rental:", error);
    res.status(500).json({message: "Internal server error occurred"});
  }
};

module.exports = {addRental, getAllRentals, updateRental, deleteRental, findRentalById,
};