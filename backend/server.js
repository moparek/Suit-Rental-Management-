const express = require("express");
require("dotenv").config();
const connectDB = require("./dbconnection/db.config");
const userRouter = require("./router/userRouter");
const inventoryRouter = require("./router/inventoryRouter");
const rentalRouter = require("./router/rentalRouter");
const authRouter = require("./router/authRouter");



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/inventory", inventoryRouter)
app.use("/api/rentals", rentalRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});