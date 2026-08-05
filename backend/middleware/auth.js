const jwt = require("jsonwebtoken");

/**
 * protect — JWT authentication middleware.
 *
 * Expects the token in the Authorization header as:
 *   Authorization: Bearer <token>
 *
 * On success, attaches the decoded payload to req.user and calls next().
 * On failure, returns 401.
 */
const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided. Authorization denied." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded; // { id, role, iat, exp }
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid token. Authorization denied." });
  }
};

module.exports = { protect };
