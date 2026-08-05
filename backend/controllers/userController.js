const users = require("../Models/users");
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
    const { name, phone, email, password, role,status } = req.body;

    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
    name,
    phone,
    email,
    password: hashedPassword,
    role,
    status
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
    const { name, phone, email, password, role,status } = req.body;
    const updateData = {
      name,
      phone,
      email,
      role,
      status
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
 //  Delete user 
const deleteUser = async(req , res) => {
  try {

    const id = req.params.id 
    const result = await User.findByIdAndDelete(id);
    res.json(result);
    
  } catch (error) {

    res.status(500).json({ message: "Internal server error occurred" });
    
  };
};

const findByphone = async(req , res) => {
  try {

    const phone = req.params.phone 
    const result = await User.findOne({phone:phone}).select("-password");
    res.json(result);
    
  } catch (error) {

    res.status(500).json({ message: "Internal server error occurred" });
    
  };
};
module.exports = { addNewUser, getAllUsers, updateUser, deleteUser , findByphone };

