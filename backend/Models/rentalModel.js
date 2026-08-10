const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema(
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
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    returnDate: {
      type: Date,
      default: null,
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
    balance: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "partial", "paid", "refunded"],
      default: "pending",
    },
    rentalStatus: {
      type: String,
      enum: ["reserved", "active", "returned", "overdue", "cancelled"],
      default: "reserved",
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

rentalSchema.pre("save", function () {
  if (this.totalAmount !== undefined && this.deposit !== undefined) {
    this.balance = this.totalAmount - this.deposit;
  }
});

rentalSchema.virtual("rentalDate").get(function () {
  return this.startDate;
}).set(function (v) {
  this.startDate = v;
});

rentalSchema.virtual("status").get(function () {
  return this.rentalStatus;
}).set(function (v) {
  this.rentalStatus = v;
});

rentalSchema.set("toJSON", { virtuals: true });
rentalSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Rental", rentalSchema);
