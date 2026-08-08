const express = require("express");
const { login, forgotPassword } = require("../controllers/authController");

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);

module.exports = authRouter;
