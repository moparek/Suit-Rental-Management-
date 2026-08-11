const Suit = require("../Models/suitModel");

const getSuits = async (req, res) => {
  try {
    const suits = await Suit.find().sort({ createdAt: -1 });
    res.json(suits);
  } catch (error) {
    console.error("Get suits error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getSuit = async (req, res) => {
  try {
    const suit = await Suit.findById(req.params.id);
    if (!suit) {
      return res.status(404).json({ message: "Suit not found" });
    }
    res.json(suit);
  } catch (error) {
    console.error("Get suit error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const createSuit = async (req, res) => {
  try {
    const { name, category, size, color, condition, description, image } = req.body;
    const dailyRate = req.body.dailyRate !== undefined ? req.body.dailyRate : (req.body.rentalPrice !== undefined ? req.body.rentalPrice : req.body.price);
    const status = req.body.status || (req.body.availability === false ? "rented" : "available");

    if (!name || !category || !size || !color || dailyRate === undefined || dailyRate === "") {
      return res.status(400).json({ message: "Name, category, size, color, and daily rate are required" });
    }

    const suit = await Suit.create({
      name,
      category,
      size,
      color,
      dailyRate: Number(dailyRate),
      status,
      condition: condition || "good",
      description,
      image,
    });

    res.status(201).json(suit);
  } catch (error) {
    console.error("Create suit error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const updateSuit = async (req, res) => {
  try {
    const { name, category, size, color, condition, description, image } = req.body;
    const dailyRate = req.body.dailyRate !== undefined ? req.body.dailyRate : (req.body.rentalPrice !== undefined ? req.body.rentalPrice : req.body.price);
    const status = req.body.status || (req.body.availability !== undefined ? (req.body.availability ? "available" : "rented") : undefined);

    const suit = await Suit.findById(req.params.id);

    if (!suit) {
      return res.status(404).json({ message: "Suit not found" });
    }

    if (name) suit.name = name;
    if (category) suit.category = category;
    if (size) suit.size = size;
    if (color) suit.color = color;
    if (dailyRate !== undefined && dailyRate !== "") suit.dailyRate = Number(dailyRate);
    if (status) suit.status = status;
    if (condition) suit.condition = condition;
    if (description !== undefined) suit.description = description;
    if (image !== undefined) suit.image = image;

    const updatedSuit = await suit.save();
    res.json(updatedSuit);
  } catch (error) {
    console.error("Update suit error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSuit = async (req, res) => {
  try {
    const suit = await Suit.findByIdAndDelete(req.params.id);
    if (!suit) {
      return res.status(404).json({ message: "Suit not found" });
    }
    res.json({ message: "Suit removed successfully", _id: req.params.id });
  } catch (error) {
    console.error("Delete suit error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {getSuits, getSuit,createSuit,updateSuit, deleteSuit};
