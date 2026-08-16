const express = require("express");
const {
  getRentals,
  getRental,
  createRental,
  updateRental,
  deleteRental,
  createCustomerBooking,
  getMyBookings,
  acceptBooking,
  rejectBooking,
  startRental,
  returnRental,
} = require("../controllers/rentalController");
const { protect, adminOrStaff } = require("../middleware/auth");

const router = express.Router();

router.get("/my-bookings", protect, getMyBookings);
router.post("/book", protect, createCustomerBooking);

router.put("/:id/accept", protect, adminOrStaff, acceptBooking);
router.put("/:id/reject", protect, adminOrStaff, rejectBooking);
router.put("/:id/start", protect, adminOrStaff, startRental);
router.put("/:id/return", protect, adminOrStaff, returnRental);

router.route("/")
  .get(protect, getRentals)
  .post(protect, createRental);

router.route("/:id")
  .get(protect, getRental)
  .put(protect, updateRental)
  .delete(protect, deleteRental);

module.exports = router;