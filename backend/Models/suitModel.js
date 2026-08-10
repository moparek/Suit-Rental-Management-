const mongoose = require("mongoose");

const suitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Suit name is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["Wedding", "Business", "Casual", "Traditional", "Formal"],
      required: [true, "Category is required"],
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      required: [true, "Size is required"],
    },
    color: {
      type: String,
      required: [true, "Color is required"],
      trim: true,
    },
    dailyRate: {
      type: Number,
      required: [true, "Daily rate is required"],
      min: 0,
    },
    status: {
      type: String,
      enum: ["available", "rented", "maintenance", "retired"],
      default: "available",
    },
    condition: {
      type: String,
      enum: ["new", "excellent", "good", "fair", "poor"],
      default: "good",
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Suit", suitSchema);
