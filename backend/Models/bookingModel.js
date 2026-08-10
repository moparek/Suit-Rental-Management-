const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
    },
    suit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suit",
      required: [true, "Suit is required"],
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
    },
    eventType: {
      type: String,
      enum: ["Wedding", "Graduation", "Business Meeting", "Party", "Other"],
      required: [true, "Event type is required"],
    },
    pickupDate: {
      type: Date,
      required: [true, "Pickup date is required"],
    },
    returnDate: {
      type: Date,
      required: [true, "Return date is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: 0,
    },
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
