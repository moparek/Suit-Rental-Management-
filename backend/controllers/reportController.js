const Inventory = require("../Models/inventory");
const Rental = require("../Models/rental");

const inventoryReport = async (req, res) => {
  try {
    const [total, available, rented, maintenance] = await Promise.all([
      Inventory.countDocuments(),
      Inventory.countDocuments({ status: "available" }),
      Inventory.countDocuments({ status: "rental" }),
      Inventory.countDocuments({ status: "maintenance" }),
    ]);
    const rentalCounts = await Rental.aggregate([
      { $group: { _id: "$inventory", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    rentalCounts.forEach((r) => {
      countMap[String(r._id)] = r.count;
    });

    const suits = await Inventory.find().lean();
    const items = suits.map((s) => ({
      _id: s._id,
      name: s.name,
      size: s.zise,
      color: s.color,
      price: s.price,
      status: s.status,
      timesRented: countMap[String(s._id)] || 0,
    }));

    res.json({ summary: { total, available, rented, maintenance }, items });
  } catch (error) {
    console.error("Error generating inventory report:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

const revenueReport = async (req, res) => {
  try {
    const { from, to } = req.query;
    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      dateFilter.$lte = toDate;
    }

    const query = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

    const rentals = await Rental.find(query).populate("inventory").lean();

    let totalRevenue = 0;
    let paidRevenue = 0;
    let unpaidRevenue = 0;
    let partialRevenue = 0;

    // Monthly breakdown
    const monthlyMap = {};

    rentals.forEach((r) => {
      const price = r.inventory?.price || 0;
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const days = Math.max(
        1,
        Math.round((end - start) / (1000 * 60 * 60 * 24))
      );
      const amount = price * days;

      totalRevenue += amount;
      if (r.paymentStatus === "paid") paidRevenue += amount;
      else if (r.paymentStatus === "unpaid") unpaidRevenue += amount;
      else if (r.paymentStatus === "partial") partialRevenue += amount;

      // Group by month (YYYY-MM)
      const month = start.toISOString().slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { month, revenue: 0, rentals: 0 };
      monthlyMap[month].revenue += amount;
      monthlyMap[month].rentals += 1;
    });

    const monthly = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    // Top 5 most-rented suits
    const suitCountMap = {};
    rentals.forEach((r) => {
      if (!r.inventory) return;
      const id = String(r.inventory._id);
      if (!suitCountMap[id]) {
        suitCountMap[id] = { name: r.inventory.name, count: 0, revenue: 0 };
      }
      const price = r.inventory.price || 0;
      const days = Math.max(
        1,
        Math.round(
          (new Date(r.endDate) - new Date(r.startDate)) / (1000 * 60 * 60 * 24)
        )
      );
      suitCountMap[id].count += 1;
      suitCountMap[id].revenue += price * days;
    });
    const topSuits = Object.values(suitCountMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json({
      summary: {
        totalRentals: rentals.length,
        totalRevenue,
        paidRevenue,
        unpaidRevenue,
        partialRevenue,
        activeRentals: rentals.filter((r) => r.status === "active").length,
        returnedRentals: rentals.filter((r) => r.status === "returned").length,
      },
      monthly,
      topSuits,
    });
  } catch (error) {
    console.error("Error generating revenue report:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

const dashboardReport = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalSuits,
      availableSuits,
      rentedSuits,
      maintenanceSuits,
      totalRentals,
      activeRentals,
      returnedToday,
      overdueRentals,
    ] = await Promise.all([
      Inventory.countDocuments(),
      Inventory.countDocuments({ status: "available" }),
      Inventory.countDocuments({ status: "rental" }),
      Inventory.countDocuments({ status: "maintenance" }),
      Rental.countDocuments(),
      Rental.countDocuments({ status: "active" }),
      Rental.countDocuments({
        status: "returned",
        returnedAt: { $gte: today, $lt: tomorrow },
      }),
      Rental.countDocuments({
        status: "active",
        endDate: { $lt: today },
      }),
    ]);

    // Revenue this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthlyRentals = await Rental.find({
      createdAt: { $gte: startOfMonth },
    }).populate("inventory");

    let monthlyRevenue = 0;
    monthlyRentals.forEach((r) => {
      const price = r.inventory?.price || 0;
      const days = Math.max(
        1,
        Math.round(
          (new Date(r.endDate) - new Date(r.startDate)) / (1000 * 60 * 60 * 24)
        )
      );
      monthlyRevenue += price * days;
    });

    // Monthly breakdown for charts
    const allRentals = await Rental.find().populate("inventory").lean();
    const monthlyMap = {};

    allRentals.forEach((r) => {
      const price = r.inventory?.price || 0;
      const start = new Date(r.startDate);
      const end = new Date(r.endDate);
      const days = Math.max(
        1,
        Math.round((end - start) / (1000 * 60 * 60 * 24))
      );
      const amount = price * days;

      const month = start.toISOString().slice(0, 7);
      if (!monthlyMap[month]) monthlyMap[month] = { month, revenue: 0, rentals: 0 };
      monthlyMap[month].revenue += amount;
      monthlyMap[month].rentals += 1;
    });

    const monthly = Object.values(monthlyMap).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    // Recent rentals (last 5)
    const recentRentals = await Rental.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("inventory")
      .lean();

    res.json({
      suits: { total: totalSuits, available: availableSuits, rented: rentedSuits, maintenance: maintenanceSuits },
      rentals: { total: totalRentals, active: activeRentals, returnedToday, overdue: overdueRentals },
      monthlyRevenue,
      monthly,
      recentRentals,
    });
  } catch (error) {
    console.error("Error generating dashboard report:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

module.exports = { inventoryReport, revenueReport, dashboardReport };
