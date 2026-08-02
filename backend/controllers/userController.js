const User = require("../Models/users");

const addNewUser = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    const newUser = new User({
      name,
      phone,
      email,
      password,
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



module.exports = {addNewUser};
