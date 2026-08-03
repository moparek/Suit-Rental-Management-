const User = require("../Models/users");
const bcrypt = require("bcrypt");

const sanitizeUser = (user) => {
  if (!user) return null;

  const userObject = user.toObject ? user.toObject() : user;
  const { password, ...rest } = userObject;
  return rest;
};

const addNewUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    res.status(201).json(sanitizeUser(result));
  } catch (error) {
    console.error("Internal server error occurred:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//get users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//updat or edit
const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, phone, email, password } = req.body;

    const updateData = {
      name,
      phone,
      email,
      password
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const result = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(sanitizeUser(result));
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};
module.exports = { addNewUser, getAllUsers, updateUser };

