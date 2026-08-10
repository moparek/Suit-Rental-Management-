const express = require("express");
const {
  getRentals,
  getRental,
  createRental,
  updateRental,
  deleteRental,
} = require("../controllers/rentalController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/")
  .get(protect, getRentals)
  .post(protect, createRental);

router.route("/:id")
  .get(protect, getRental)
  .put(protect, updateRental)
  .delete(protect, deleteRental);

module.exports = router;