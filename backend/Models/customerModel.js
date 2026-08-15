const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    idType: {
      type: String,
      enum: ["nationalId", "passport"],
      required: [true, "ID type is required"],
    },
    totalRentals: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.virtual("fullName").get(function () {
  return this.name;
}).set(function (v) {
  this.name = v;
});

customerSchema.virtual("nationalId").get(function () {
  return this.idType === "nationalId";
});

customerSchema.virtual("passport").get(function () {
  return this.idType === "passport";
});

customerSchema.virtual("displayId").get(function () {
  if (!this.idType) return "";
  return this.idType === "passport" ? "Passport" : "National ID";
});

customerSchema.set("toJSON", { virtuals: true });
customerSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Customer", customerSchema);
