const express = require("express");
const rentalController = require("../controllers/rentalController");

const router = express.Router();

router.post("/create", rentalController.addRental);
router.get("/getAll", rentalController.getAllRentals);
router.get("/update/:id", rentalController.findRentalById);
router.put("/update/:id", rentalController.updateRental);
router.delete("/delete/:id", rentalController.deleteRental);
router.get("/:id", rentalController.findRentalById);

module.exports = router;