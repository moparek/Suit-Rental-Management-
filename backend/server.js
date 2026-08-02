const express = require("express");
const connectDB = require("./dbconnection/db.config");

const app = express();
app.use(express.json()); 

connectDB();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});