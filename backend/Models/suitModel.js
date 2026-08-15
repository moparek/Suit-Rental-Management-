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
      enum: ["Wedding", "Business", "Casual", "Traditional", "Formal", "Tuxedo"],
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

suitSchema.virtual("rentalPrice").get(function () {
  return this.dailyRate;
}).set(function (v) {
  this.dailyRate = v;
});

suitSchema.virtual("price").get(function () {
  return this.dailyRate;
});

suitSchema.virtual("availability").get(function () {
  return this.status === "available";
}).set(function (v) {
  this.status = v ? "available" : "rented";
});

suitSchema.set("toJSON", { virtuals: true });
suitSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Suit", suitSchema);
