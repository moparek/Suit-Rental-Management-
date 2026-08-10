const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/")
  .get(protect, getAllUsers)
  .post(protect, createUser);

router.route("/:id")
  .put(protect, updateUser)
  .delete(protect, deleteUser);

router.patch("/:id/status", protect, updateUserStatus);

module.exports = router;
