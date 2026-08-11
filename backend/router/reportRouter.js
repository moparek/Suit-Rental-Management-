const express = require("express");
const {
  getRevenueReport,
  getRentalReport,
  getCustomerReport,
  getSuitReport,
} = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/revenue", protect, getRevenueReport);
router.get("/rentals", protect, getRentalReport);
router.get("/customers", protect, getCustomerReport);
router.get("/suits", protect, getSuitReport);

module.exports = router;
