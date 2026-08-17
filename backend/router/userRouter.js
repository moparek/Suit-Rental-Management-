const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(protect, adminOnly, getAllUsers)
  .post(protect, adminOnly, createUser);

router
  .route("/:id")
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser);

router.patch("/:id/status", protect, adminOnly, updateUserStatus);

module.exports = router;
