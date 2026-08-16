const express = require("express");
const {
  getAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.route("/")
  .get(protect, getAllUsers)
  .post(protect, authorize("admin"), createUser);

router.route("/:id")
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);

router.patch("/:id/status", protect, authorize("admin"), updateUserStatus);

module.exports = router;