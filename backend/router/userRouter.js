const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/create", userController.addNewUser);
router.get("/getAll", userController.getAllUsers);
router.put("/update/:id", userController.updateUser);

module.exports = router;
