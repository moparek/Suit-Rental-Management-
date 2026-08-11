const Rental = require("../Models/rentalModel");
const Suit = require("../Models/suitModel");
const Customer = require("../Models/customerModel");

const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("customer", "name phone email")
      .populate("suit", "name category size color dailyRate")
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    console.error("Get rentals error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("customer", "name phone email")
      .populate("suit", "name category size color dailyRate");

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }
    res.json(rental);
  } catch (error) {
    console.error("Get rental error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createRental = async (req, res) => {
  try {
    const {
      customer,
      suit,
      startDate,
      endDate,
      totalAmount,
      deposit,
      paymentStatus,
      rentalStatus,
      notes,
    } = req.body;

    if (!customer || !suit || !startDate || !endDate || totalAmount === undefined) {
      return res.status(400).json({ message: "Customer, suit, start date, end date, and total amount are required" });
    }

    const suitItem = await Suit.findById(suit);
    if (!suitItem) {
      return res.status(404).json({ message: "Suit not found" });
    }

    const rental = await Rental.create({
      customer,
      suit,
      startDate,
      endDate,
      totalAmount,
      deposit: deposit || 0,
      balance: totalAmount - (deposit || 0),
      paymentStatus: paymentStatus || "pending",
      rentalStatus: rentalStatus || "reserved",
      notes,
    });

    // Update suit status if rented/active
    if (rentalStatus === "active") {
      suitItem.status = "rented";
      await suitItem.save();
    }

    // Increment customer total rentals
    await Customer.findByIdAndUpdate(customer, { $inc: { totalRentals: 1 } });

    const populatedRental = await Rental.findById(rental._id)
      .populate("customer", "name phone email")
      .populate("suit", "name category size color dailyRate");

    res.status(201).json(populatedRental);
  } catch (error) {
    console.error("Create rental error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRental = async (req, res) => {
  try {
    const {
      customer,
      suit,
      startDate,
      endDate,
      returnDate,
      totalAmount,
      deposit,
      paymentStatus,
      rentalStatus,
      notes,
    } = req.body;

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    if (customer) rental.customer = customer;
    if (suit) rental.suit = suit;
    if (startDate) rental.startDate = startDate;
    if (endDate) rental.endDate = endDate;
    if (returnDate !== undefined) rental.returnDate = returnDate;
    if (totalAmount !== undefined) rental.totalAmount = totalAmount;
    if (deposit !== undefined) rental.deposit = deposit;
    if (paymentStatus) rental.paymentStatus = paymentStatus;
    if (notes !== undefined) rental.notes = notes;

    // Handle status change transitions
    if (rentalStatus && rentalStatus !== rental.rentalStatus) {
      rental.rentalStatus = rentalStatus;

      if (rentalStatus === "returned") {
        rental.returnDate = returnDate || new Date();
        await Suit.findByIdAndUpdate(rental.suit, { status: "available" });
      } else if (rentalStatus === "active") {
        await Suit.findByIdAndUpdate(rental.suit, { status: "rented" });
      } else if (rentalStatus === "cancelled") {
        await Suit.findByIdAndUpdate(rental.suit, { status: "available" });
      }
    }

    const updatedRental = await rental.save();

    const populatedRental = await Rental.findById(updatedRental._id)
      .populate("customer", "name phone email")
      .populate("suit", "name category size color dailyRate");

    res.json(populatedRental);
  } catch (error) {
    console.error("Update rental error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }
    if (rental.rentalStatus === "active" || rental.rentalStatus === "reserved") {
      await Suit.findByIdAndUpdate(rental.suit, { status: "available" });
    }

    await Rental.findByIdAndDelete(req.params.id);
    res.json({ message: "Rental removed successfully", _id: req.params.id });
  } catch (error) {
    console.error("Delete rental error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {getRentals,getRental,createRental,updateRental,deleteRental};