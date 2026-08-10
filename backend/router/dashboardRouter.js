const express = require("express");
const {
  getDashboardStats,
  getRecentActivity,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/recent-activity", protect, getRecentActivity);

module.exports = router;
