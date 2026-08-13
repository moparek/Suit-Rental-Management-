const Customer = require("../Models/customerModel");
const Suit = require("../Models/suitModel");
const Rental = require("../Models/rentalModel");
const Booking = require("../Models/bookingModel");
const User = require("../Models/userModel");

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const parseStartDate = (startDate) => {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  return start;
};

const parseEndDate = (endDate) => {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return end;
};

const buildDateQuery = (startDate, endDate) => {
  if (!startDate && !endDate) return {};
  const query = { createdAt: {} };
  if (startDate) query.createdAt.$gte = parseStartDate(startDate);
  if (endDate) query.createdAt.$lte = parseEndDate(endDate);
  return query;
};

const buildYearlyTrend = (rentals) => {
  const monthlyMap = {};
  const monthlyRentalMap = {};
  MONTHS.forEach((m) => {
    monthlyMap[m] = 0;
    monthlyRentalMap[m] = 0;
  });

  rentals.forEach((rental) => {
    if (rental.createdAt) {
      const monthName = MONTHS[new Date(rental.createdAt).getMonth()];
      monthlyMap[monthName] += rental.totalAmount || 0;
      monthlyRentalMap[monthName] += 1;
    }
  });

  return {
    monthlyRevenue: MONTHS.map((month) => ({ period: month, revenue: monthlyMap[month] })),
    monthlyRentals: MONTHS.map((month) => ({ period: month, count: monthlyRentalMap[month] })),
  };
};

const buildRangeTrend = (rentals, startDate, endDate) => {
  const start = parseStartDate(startDate);
  const end = parseEndDate(endDate);
  const diffDays = Math.ceil((end - start) / 86400000) + 1;
  const buckets = [];

  if (diffDays <= 31) {
    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
      const dayStart = new Date(cursor);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(cursor);
      dayEnd.setHours(23, 59, 59, 999);
      buckets.push({
        period: `${MONTHS[cursor.getMonth()]} ${cursor.getDate()}`,
        dayStart,
        dayEnd,
        revenue: 0,
        count: 0,
      });
    }
  } else {
    let cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cursor <= end) {
      const monthStart = new Date(cursor);
      const monthEnd = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59, 999);
      buckets.push({
        period: `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`,
        dayStart: monthStart < start ? start : monthStart,
        dayEnd: monthEnd > end ? end : monthEnd,
        revenue: 0,
        count: 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  rentals.forEach((rental) => {
    if (!rental.createdAt) return;
    const created = new Date(rental.createdAt);
    for (const bucket of buckets) {
      if (created >= bucket.dayStart && created <= bucket.dayEnd) {
        bucket.revenue += rental.totalAmount || 0;
        bucket.count += 1;
        break;
      }
    }
  });

  return {
    monthlyRevenue: buckets.map(({ period, revenue }) => ({ period, revenue })),
    monthlyRentals: buckets.map(({ period, count }) => ({ period, count })),
  };
};

const buildRentalsByCategory = (rentals) => {
  const categoryMap = {};
  rentals.forEach((rental) => {
    if (rental.suit && rental.suit.category) {
      const cat = rental.suit.category;
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    }
  });

  return Object.keys(categoryMap).map((category) => ({
    category,
    count: categoryMap[category],
  }));
};

const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const hasDateFilter = Boolean(startDate || endDate);
    const dateQuery = buildDateQuery(startDate, endDate);

    if (!hasDateFilter) {
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
      const utilizationRate = totalSuits > 0
        ? Math.round(((totalSuits - availableSuits) / totalSuits) * 100)
        : 0;

      const { monthlyRevenue, monthlyRentals } = buildYearlyTrend(rentalsList);
      const rentalsByCategory = buildRentalsByCategory(rentalsList);

      return res.json({
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
    }

    const [totalSuits, availableSuits, rentalsList, paidRentals, newCustomers] = await Promise.all([
      Suit.countDocuments(),
      Suit.countDocuments({ status: "available" }),
      Rental.find(dateQuery).populate("suit"),
      Rental.find({ ...dateQuery, paymentStatus: "paid" }),
      Customer.countDocuments(dateQuery),
    ]);

    const totalRevenue = paidRentals.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const utilizationRate = totalSuits > 0
      ? Math.round(((totalSuits - availableSuits) / totalSuits) * 100)
      : 0;

    const { monthlyRevenue, monthlyRentals } = buildRangeTrend(
      rentalsList,
      startDate,
      endDate,
    );
    const rentalsByCategory = buildRentalsByCategory(rentalsList);

    res.json({
      totalRevenue,
      rentedSuits: rentalsList.length,
      newCustomers,
      utilizationRate,
      monthlyRevenue,
      monthlyRentals,
      rentalsByCategory,
      dateRange: { startDate, endDate },
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

module.exports = { getDashboardStats, getRecentActivity };
