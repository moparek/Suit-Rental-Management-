const express = require("express");
const {
  getRentals,
  getRental,
  createRental,
  updateRental,
  deleteRental,
  createCustomerBooking,
  getMyBookings,
} = require("../controllers/rentalController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/my-bookings", protect, getMyBookings);
router.post("/book", protect, createCustomerBooking);

router.route("/")
  .get(protect, getRentals)
  .post(protect, createRental);

router.route("/:id")
  .get(protect, getRental)
  .put(protect, updateRental)
  .delete(protect, deleteRental);

module.exports = router;