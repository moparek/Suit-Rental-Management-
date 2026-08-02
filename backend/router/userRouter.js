const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/create", userController.addNewUser);


module.exports = router;
