const express = require("express");
const {
  getSuits,
  getSuit,
  createSuit,
  updateSuit,
  deleteSuit,
} = require("../controllers/suitController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/")
  .get(protect, getSuits)
  .post(protect, createSuit);

router.route("/:id")
  .get(protect, getSuit)
  .put(protect, updateSuit)
  .delete(protect, deleteSuit);

module.exports = router;
