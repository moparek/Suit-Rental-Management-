const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./dbconnection/db.config");

const authRouter = require("./router/authRouter");
const userRouter = require("./router/userRouter");
const customerRouter = require("./router/customerRouter");
const suitRouter = require("./router/suitRouter");
const rentalRouter = require("./router/rentalRouter");
const bookingRouter = require("./router/bookingRouter");
const reportRouter = require("./router/reportRouter");
const dashboardRouter = require("./router/dashboardRouter");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/customers", customerRouter);
app.use("/api/suits", suitRouter);
app.use("/api/inventory", suitRouter); // Alias for backwards compatibility
app.use("/api/rentals", rentalRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reports", reportRouter);
app.use("/api/dashboard", dashboardRouter);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error occurred",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});