const User = require("../Models/users");
const bcrypt = require("bcrypt");

const addNewUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const hashed=await bcrypt.hash(password,10)
    const newUser = new User({
      name,
      phone,
      email,
      password:hashed
    });

    const result = await newUser.save();
    const response = result.toObject();
    delete response.password;

    res.status(201).json(response);
  } catch (error) {
    console.error("internal server error occurred", error);
    res.status(500).json({ message: "internal server error occurred" });
  }
};


const getAllUsers= async(req, res)=>{
    const list= await User.find();
    res.json(list)  
}

module.exports = {addNewUser, getAllUsers};
