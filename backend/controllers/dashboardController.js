const Customer = require("../Models/customerModel");
const Suit = require("../Models/suitModel");
const Rental = require("../Models/rentalModel");
const Booking = require("../Models/bookingModel");
const User = require("../Models/userModel");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalSuits,
      activeRentals,
      returnedRentals,
      availableSuits,
      rentedSuits,
      pendingBookings,
      totalStaff,
      paidRentals,
      rentalsList,
    ] = await Promise.all([
      Customer.countDocuments(),
      Suit.countDocuments(),
      Rental.countDocuments({ rentalStatus: "active" }),
      Rental.countDocuments({ rentalStatus: "returned" }),
      Suit.countDocuments({ status: "available" }),
      Suit.countDocuments({ status: "rented" }),
      Booking.countDocuments({ status: "pending" }),
      User.countDocuments(),
      Rental.find({ paymentStatus: "paid" }),
      Rental.find().populate("suit"),
    ]);

    const totalRevenue = paidRentals.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const utilizationRate = totalSuits > 0 ? Math.round(((totalSuits - availableSuits) / totalSuits) * 100) : 0;

    // Monthly revenue breakdown
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap = {};
    months.forEach((m) => { monthlyMap[m] = 0; });

    rentalsList.forEach((rental) => {
      if (rental.createdAt) {
        const monthName = months[new Date(rental.createdAt).getMonth()];
        monthlyMap[monthName] += (rental.totalAmount || 0);
      }
    });

    const monthlyRevenue = months.map((month) => ({
      month,
      revenue: monthlyMap[month],
    }));

    const monthlyRentalMap = {};
    months.forEach((m) => {
      monthlyRentalMap[m] = 0;
    });

    rentalsList.forEach((rental) => {
      if (rental.createdAt) {
        const monthName = months[new Date(rental.createdAt).getMonth()];
        monthlyRentalMap[monthName] += 1;
      }
    });

    const monthlyRentals = months.map((month) => ({
      month,
      count: monthlyRentalMap[month],
    }));

    // Rentals by category
    const categoryMap = {};
    rentalsList.forEach((rental) => {
      if (rental.suit && rental.suit.category) {
        const cat = rental.suit.category;
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      }
    });

    const rentalsByCategory = Object.keys(categoryMap).map((category) => ({
      category,
      count: categoryMap[category],
    }));

    res.json({
      totalCustomers,
      totalSuits,
      activeRentals,
      returnedRentals,
      availableSuits,
      rentedSuits: rentedSuits || activeRentals,
      totalStaff,
      newCustomers: totalCustomers,
      utilizationRate,
      totalRevenue,
      pendingBookings,
      monthlyRevenue,
      monthlyRentals,
      rentalsByCategory,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const recentRentals = await Rental.find()
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBookings = await Booking.find()
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const activities = [];

    recentRentals.forEach((r) => {
      const customerName = r.customer ? r.customer.name : "Customer";
      activities.push({
        _id: r._id,
        type: "rental",
        description: `New rental created for ${customerName}`,
        date: r.createdAt ? r.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        status: r.rentalStatus,
      });
    });

    recentBookings.forEach((b) => {
      const customerName = b.customer ? b.customer.name : "Customer";
      activities.push({
        _id: b._id,
        type: "booking",
        description: `New booking by ${customerName}`,
        date: b.createdAt ? b.createdAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        status: b.status,
      });
    });

    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(activities.slice(0, 10));
  } catch (error) {
    console.error("Get recent activity error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {getDashboardStats,getRecentActivity};
