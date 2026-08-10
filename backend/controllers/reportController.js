const Rental = require("../Models/rentalModel");
const Customer = require("../Models/customerModel");
const Suit = require("../Models/suitModel");

const filterByDates = (query, startDate, endDate) => {
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }
  return query;
};

// @desc    Revenue Report
// @route   GET /api/reports/revenue
const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = filterByDates({}, startDate, endDate);

    const rentals = await Rental.find(query).sort({ createdAt: -1 });

    const report = rentals.map((r) => ({
      _id: r._id,
      date: r.createdAt ? r.createdAt.toISOString().split("T")[0] : "",
      rentals: 1,
      revenue: r.totalAmount || 0,
      deposit: r.deposit || 0,
      paymentStatus: r.paymentStatus,
    }));

    res.json(report);
  } catch (error) {
    console.error("Revenue report error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getRentalReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = filterByDates({}, startDate, endDate);

    const rentals = await Rental.find(query)
      .populate("customer", "name")
      .populate("suit", "name")
      .sort({ createdAt: -1 });

    const report = rentals.map((r) => {
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));

      return {
        _id: r._id,
        customer: r.customer ? r.customer.name : "N/A",
        suit: r.suit ? r.suit.name : "N/A",
        duration: `${days} ${days === 1 ? "day" : "days"}`,
        amount: r.totalAmount || 0,
        status: r.rentalStatus,
      };
    });

    res.json(report);
  } catch (error) {
    console.error("Rental report error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCustomerReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const customers = await Customer.find().lean();
    const rentals = await Rental.find().populate("customer").lean();

    const customerSpentMap = {};
    const customerLastRentalMap = {};

    rentals.forEach((r) => {
      if (r.customer) {
        const custId = String(r.customer._id);
        customerSpentMap[custId] = (customerSpentMap[custId] || 0) + (r.totalAmount || 0);
        if (!customerLastRentalMap[custId] || new Date(r.createdAt) > new Date(customerLastRentalMap[custId])) {
          customerLastRentalMap[custId] = r.createdAt;
        }
      }
    });

    const report = customers.map((c) => ({
      _id: c._id,
      customer: c.name,
      totalRentals: c.totalRentals || 0,
      totalSpent: customerSpentMap[String(c._id)] || 0,
      lastRental: customerLastRentalMap[String(c._id)]
        ? new Date(customerLastRentalMap[String(c._id)]).toISOString().split("T")[0]
        : "N/A",
    }));

    res.json(report);
  } catch (error) {
    console.error("Customer report error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getSuitReport = async (req, res) => {
  try {
    const suits = await Suit.find().lean();
    const rentals = await Rental.find().populate("suit").lean();

    const suitRentalCount = {};
    const suitRevenueMap = {};

    rentals.forEach((r) => {
      if (r.suit) {
        const suitId = String(r.suit._id);
        suitRentalCount[suitId] = (suitRentalCount[suitId] || 0) + 1;
        suitRevenueMap[suitId] = (suitRevenueMap[suitId] || 0) + (r.totalAmount || 0);
      }
    });

    const report = suits.map((s) => ({
      _id: s._id,
      suit: s.name,
      category: s.category,
      timesRented: suitRentalCount[String(s._id)] || 0,
      revenue: suitRevenueMap[String(s._id)] || 0,
      status: s.status,
    }));

    res.json(report);
  } catch (error) {
    console.error("Suit report error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {getRevenueReport, getRentalReport, getCustomerReport, getSuitReport};
