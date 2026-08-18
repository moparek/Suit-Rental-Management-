const Rental = require("../Models/rentalModel");
const Suit = require("../Models/suitModel");
const Customer = require("../Models/customerModel");

const normalizeRentalStatus = (status) => {
  if (!status) return "active";
  const normalized = String(status).toLowerCase();
  const allowed = ["reserved", "active", "returned", "overdue", "cancelled"];
  return allowed.includes(normalized) ? normalized : "active";
};

const normalizePaymentStatus = (status) => {
  if (!status) return "pending";
  const normalized = String(status).toLowerCase();
  const allowed = ["pending", "partial", "paid", "refunded"];
  return allowed.includes(normalized) ? normalized : "pending";
};

const calculateRentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / 86400000);
  return Math.max(1, diff);
};

const getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("customer", "name phone email idType")
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
      .populate("customer", "name phone email idType")
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
      deposit,
      notes,
    } = req.body;

    const startDate = req.body.startDate || req.body.rentalDate;
    let endDate = req.body.endDate || req.body.returnDate;

    if (!endDate && startDate && req.body.rentalDays) {
      endDate = new Date(new Date(startDate).getTime() + Number(req.body.rentalDays) * 86400000);
    }

    const rentalStatus = normalizeRentalStatus(req.body.rentalStatus || req.body.status);
    const paymentStatus = normalizePaymentStatus(req.body.paymentStatus);

    if (!customer || !suit || !startDate || !endDate) {
      return res.status(400).json({ message: "Customer, suit, rental date, and return date are required" });
    }

    const suitItem = await Suit.findById(suit);
    if (!suitItem) {
      return res.status(404).json({ message: "Suit not found" });
    }

    const rentalDays = calculateRentalDays(startDate, endDate);
    const totalAmount =
      req.body.totalAmount !== undefined
        ? Number(req.body.totalAmount)
        : rentalDays * suitItem.dailyRate;

    const rental = await Rental.create({
      customer,
      suit,
      startDate,
      endDate,
      returnDate: rentalStatus === "returned" ? endDate : null,
      totalAmount,
      deposit: deposit || 0,
      balance: totalAmount - (deposit || 0),
      paymentStatus,
      rentalStatus,
      isOnlineBooking: false,
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
      .populate("customer", "name phone email idType")
      .populate("suit", "name category size color dailyRate");

    res.status(201).json(populatedRental);
  } catch (error) {
    console.error("Create rental error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((e) => e.message).join(", ") });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateRental = async (req, res) => {
  try {
    const {
      customer,
      suit,
      deposit,
      notes,
    } = req.body;

    const startDate = req.body.startDate || req.body.rentalDate;
    const endDate = req.body.endDate || req.body.returnDate;
    const rentalStatus = req.body.rentalStatus || req.body.status;
    const paymentStatus = req.body.paymentStatus;
    let { totalAmount } = req.body;

    const rental = await Rental.findById(req.params.id);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    if (customer) rental.customer = customer;
    if (suit) rental.suit = suit;
    if (startDate) rental.startDate = startDate;
    if (endDate) rental.endDate = endDate;
    if (deposit !== undefined) rental.deposit = deposit;
    if (paymentStatus) rental.paymentStatus = normalizePaymentStatus(paymentStatus);
    if (notes !== undefined) rental.notes = notes;

    if (totalAmount === undefined && (startDate || endDate || suit)) {
      const suitId = suit || rental.suit;
      const suitItem = await Suit.findById(suitId);
      if (suitItem) {
        const days = calculateRentalDays(
          startDate || rental.startDate,
          endDate || rental.endDate
        );
        totalAmount = days * suitItem.dailyRate;
      }
    }
    if (totalAmount !== undefined) rental.totalAmount = totalAmount;

    const normalizedRentalStatus = rentalStatus ? normalizeRentalStatus(rentalStatus) : null;

    // Handle status change transitions
    if (normalizedRentalStatus && normalizedRentalStatus !== rental.rentalStatus) {
      rental.rentalStatus = normalizedRentalStatus;

      if (normalizedRentalStatus === "returned") {
        rental.returnDate = req.body.actualReturnDate || new Date();
        await Suit.findByIdAndUpdate(rental.suit, { status: "available" });
      } else if (normalizedRentalStatus === "active") {
        await Suit.findByIdAndUpdate(rental.suit, { status: "rented" });
      } else if (normalizedRentalStatus === "cancelled") {
        await Suit.findByIdAndUpdate(rental.suit, { status: "available" });
      }
    } else if (normalizedRentalStatus) {
      rental.rentalStatus = normalizedRentalStatus;
    }

    const updatedRental = await rental.save();

    const populatedRental = await Rental.findById(updatedRental._id)
      .populate("customer", "name phone email idType")
      .populate("suit", "name category size color dailyRate");

    res.json(populatedRental);
  } catch (error) {
    console.error("Update rental error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((e) => e.message).join(", ") });
    }
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

const createCustomerBooking = async (req, res) => {
  try {
    const { suit, startDate, endDate, notes } = req.body;
    
    const User = require("../Models/userModel");
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    let customer = await Customer.findOne({ email: user.email });
    if (!customer) {
      customer = await Customer.create({
        name: user.name,
        phone: user.phone,
        email: user.email,
        idType: "nationalId",
      });
    }

    if (!suit || !startDate || !endDate) {
      return res.status(400).json({ message: "Suit, start date, and end date are required" });
    }

    const suitItem = await Suit.findById(suit);
    if (!suitItem) {
      return res.status(404).json({ message: "Suit not found" });
    }

    if (suitItem.status !== "available") {
      return res.status(409).json({ message: "Suit is no longer available" });
    }

    const rentalDays = calculateRentalDays(startDate, endDate);
    const totalAmount = rentalDays * suitItem.dailyRate;

    const rental = await Rental.create({
      customer: customer._id,
      suit,
      startDate,
      endDate,
      totalAmount,
      deposit: 0,
      balance: totalAmount,
      paymentStatus: "pending",
      rentalStatus: "pending",
      isOnlineBooking: true,
      notes,
    });

    suitItem.status = "reserved";
    await suitItem.save();

    await Customer.findByIdAndUpdate(customer._id, { $inc: { totalRentals: 1 } });

    const populatedRental = await Rental.findById(rental._id)
      .populate("customer", "name phone email idType")
      .populate("suit", "name category size color dailyRate");

    res.status(201).json(populatedRental);
  } catch (error) {
    console.error("Create customer booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const User = require("../Models/userModel");
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const customer = await Customer.findOne({ email: user.email });
    if (!customer) {
      return res.json([]);
    }

    const rentals = await Rental.find({ customer: customer._id })
      .populate("suit", "name category size color dailyRate image")
      .sort({ createdAt: -1 });
      
    res.json(rentals);
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const acceptBooking = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (rental.rentalStatus !== "pending") return res.status(400).json({ message: "Can only accept pending bookings" });

    rental.rentalStatus = "accepted";
    await rental.save();
    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (rental.rentalStatus !== "pending") return res.status(400).json({ message: "Can only reject pending bookings" });

    rental.rentalStatus = "rejected";
    await rental.save();

    await Suit.findByIdAndUpdate(rental.suit, { status: "available" });

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const startRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    if (rental.rentalStatus !== "accepted") return res.status(400).json({ message: "Can only start accepted bookings" });

    rental.rentalStatus = "active";
    await rental.save();

    await Suit.findByIdAndUpdate(rental.suit, { status: "rented" });

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const returnRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });
    
    // Virtual status might be overdue, but rentalStatus in DB is active
    if (rental.rentalStatus !== "active") return res.status(400).json({ message: "Can only return active or overdue rentals" });

    rental.rentalStatus = "returned";
    rental.returnDate = new Date();
    await rental.save();

    await Suit.findByIdAndUpdate(rental.suit, { status: "available" });

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {getRentals,getRental,createRental,updateRental,deleteRental,createCustomerBooking,getMyBookings,acceptBooking,rejectBooking,startRental,returnRental};