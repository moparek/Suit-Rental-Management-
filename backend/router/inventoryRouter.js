const express = require("express");
const inventoryController = require("../controllers/inventoryController");

const router = express.Router();


router.get("/stats", inventoryController.getDashboardStats);
router.get("/available", inventoryController.getAvailableInventory);

// CRUD
router.post("/create", inventoryController.addInventory);
router.get("/getAll", inventoryController.getAllinventory);
router.get("/getOne/:id", inventoryController.findByid);
router.put("/update/:id", inventoryController.updateInventory);
router.delete("/delete/:id", inventoryController.deleteInventory);

module.exports = router;