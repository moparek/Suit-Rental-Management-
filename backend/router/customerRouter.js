const express = require("express");
const {
  getCustomers,
  getCustomer,
  getCustomerHistory,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/")
  .get(protect, getCustomers)
  .post(protect, createCustomer);

router.get("/:id/history", protect, getCustomerHistory);

router.route("/:id")
  .get(protect, getCustomer)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

module.exports = router;
