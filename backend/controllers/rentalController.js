const mongoose = require("mongoose");
const Rental = require("../Models/rental");
const Inventory = require("../Models/inventory");

//  Add Rental 
const addRental = async (req, res) => {
  try {
    const body = req.body || {};
    const {inventoryId, name, phone, phoneTwo, deposit, startDate, endDate, paymentStatus} = body;
    if (!inventoryId || !name || !phone || !phoneTwo || !startDate || !endDate) {
      return res.status(400)
        .json({ message: "inventoryId, name, phone, phoneTwo, startDate and endDate are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
      return res.status(400).json({ message: "Invalid inventoryId" });
    }
    const inventoryItem = await Inventory.findById(inventoryId);
    if (!inventoryItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    if (inventoryItem.status === "rental") {
      return res.status(409).json({ message: "This suit is already rented and not available" });
    }

    if (inventoryItem.status === "maintenance") {
      return res.status(409).json({ message: "This suit is under maintenance and not available" });
    }
    const newRental = new Rental({
      inventory: inventoryId,
      name,
      phone,
      phoneTwo,
      deposit,
      startDate,
      endDate,
      paymentStatus,
    });
    const savedRental = await newRental.save();
    inventoryItem.status = "rental";
    await inventoryItem.save();

    const result = await Rental.findById(savedRental._id).populate("inventory");
    res.status(201).json(result);
  } catch (error) {
    console.error("Error creating rental:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//  Get All Rentals ─
const getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().populate("inventory");
    res.json(rentals);
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//  Find Rental By ID
const findRentalById = async (req, res) => {
  try {
    const idRaw = req.params.id || "";
    const id = idRaw.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid rental id" });
    }

    const result = await Rental.findById(id).populate("inventory");
    if (!result) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error finding rental:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//  Update Rental 
const updateRental = async (req, res) => {
  try {
    const idRaw = req.params.id || "";
    const id = idRaw.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid rental id" });
    }

    const { name, phone, phoneTwo, deposit, startDate, endDate, paymentStatus } =
      req.body || {};
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (phoneTwo !== undefined) updateData.phoneTwo = phoneTwo;
    if (deposit !== undefined) updateData.deposit = deposit;
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (paymentStatus !== undefined) updateData.paymentStatus = paymentStatus;

    const result = await Rental.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("inventory");

    if (!result) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error updating rental:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//  Return a Suit 
const returnRental = async (req, res) => {
  try {
    const idRaw = req.params.id || "";
    const id = idRaw.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid rental id" });
    }
    //Find the rental
    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }
    if (rental.status === "returned") {
      return res.status(409).json({ message: "This rental has already been returned" });
    }

    const inventoryItem = await Inventory.findById(rental.inventory);
    if (inventoryItem) {
      inventoryItem.status = "available";
      await inventoryItem.save();
    }
    rental.status = "returned";
    rental.returnedAt = new Date();
    await rental.save();

    const result = await Rental.findById(id).populate("inventory");
    res.json(result);
  } catch (error) {
    console.error("Error returning rental:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//  Delete Rental 
const deleteRental = async (req, res) => {
  try {
    const idRaw = req.params.id || "";
    const id = idRaw.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid rental id" });
    }

    const result = await Rental.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Rental not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error deleting rental:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

module.exports = {addRental, getAllRentals, findRentalById, updateRental, returnRental, deleteRental};