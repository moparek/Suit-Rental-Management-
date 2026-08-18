const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    customerName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    suit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suit",
      required: [true, "Suit is required"],
    },
    size: {
      type: String,
      default: "M",
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    eventType: {
      type: String,
      default: "Other",
    },
    pickupDate: {
      type: Date,
      default: Date.now,
    },
    returnDate: {
      type: Date,
      default: () => new Date(Date.now() + 86400000 * 3),
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    deposit: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      default: "Reserved",
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

bookingSchema.virtual("bookingDate").get(function () {
  return this.eventDate || this.createdAt;
}).set(function (v) {
  this.eventDate = v;
});

bookingSchema.virtual("price").get(function () {
  return this.totalAmount;
}).set(function (v) {
  this.totalAmount = v;
});

bookingSchema.set("toJSON", { virtuals: true });
bookingSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Booking", bookingSchema);
