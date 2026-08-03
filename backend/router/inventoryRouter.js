const express = require("express");
const inventory = require("../Models/inventory");
const inventoryController = require("../controllers/inventoryController")



const router = express.Router();

router.post("/create", inventoryController.addInventory);
router.get("/getAll", inventoryController.getAllinventory );
router.put("/update/:id", inventoryController.updateInventory);
router.delete("/delete/:id",inventoryController.deleteInventory);


module.exports = router;