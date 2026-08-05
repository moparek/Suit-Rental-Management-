const express = require("express");
const rentalController = require("../controllers/rentalController");

const router = express.Router();

// CRUD
router.post("/create", rentalController.addRental);
router.get("/getAll", rentalController.getAllRentals);
router.get("/getOne/:id", rentalController.findRentalById);
router.put("/update/:id", rentalController.updateRental);
router.delete("/delete/:id", rentalController.deleteRental);

// Return workflow
router.patch("/return/:id", rentalController.returnRental);

module.exports = router;