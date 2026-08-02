const express = require("express");
require("dotenv").config();
const connectDB = require("./dbconnection/db.config");
const userRouter = require("./router/userRouter");

const app = express();
app.use(express.json());

connectDB();

app.use("/api/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});