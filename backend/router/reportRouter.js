const express = require("express");
const { inventoryReport, revenueReport, dashboardReport } = require("../controllers/reportController");
const { protect } = require("../middleware/auth");

const reportRouter = express.Router();

reportRouter.get("/inventory", protect, inventoryReport);
reportRouter.get("/revenue", protect, revenueReport);
reportRouter.get("/dashboard", protect, dashboardReport);

module.exports = reportRouter;
