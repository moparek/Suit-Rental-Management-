const User = require("../Models/userModel");

// @desc    Get all users/staff
// @route   GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @desc    Create a new user/staff
// @route   POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, status } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Name, email, phone, and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: role || "staff",
      status: status || "active",
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, status, password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (status) user.status = status;
    if (password) user.password = password;

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = status || (user.status === "active" ? "inactive" : "active");
    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json(userObj);
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User removed successfully", _id: req.params.id });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {getAllUsers, createUser,updateUser,updateUserStatus,deleteUser};
