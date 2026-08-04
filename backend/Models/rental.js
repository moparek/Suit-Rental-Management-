const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
  },
  phoneTwo: {
    type: String,
    required: true,
  },

  deposit: {
    type: String,
  },

  startDate: {
    type: Date,
    required: true,
  },

  paymentStatus: {
  type: String,
  enum: ["paid", "unpaid", "partial"],
  default: "paid",
  required: true,
},

  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.startDate;
      },
      message: "End date must be after start date.",
    },
  },
});

module.exports = mongoose.model("Rental", rentalSchema);