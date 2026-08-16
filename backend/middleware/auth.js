const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided. Authorization denied." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token. Authorization denied." });
  }
};

const adminOrStaff = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!["admin", "staff", "manager"].includes(user.role)) {
      return res.status(403).json({ message: "Access denied. Admin or staff only." });
    }
    req.user.role = user.role;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error checking permissions" });
  }
};

module.exports = { protect, adminOrStaff };

