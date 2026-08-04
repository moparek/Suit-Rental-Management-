
const Inventory = require("../Models/inventory");




const addInventory = async (req, res) => {
  try {
    const { name, zise, color, price, status , image } = req.body;

    if (!name || !zise || !color || !price || !status || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const newInventory = new Inventory({
      name,
      zise,
      color,
      price,
      status,
      image
    });

    const result = await newInventory.save();
    res.status(201).json((result));
  } catch (error) {
    console.error("Internal server error occurred:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//get inventory
const getAllinventory = async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};

//updat or edit
const updateInventory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, zise, color, price, status, image } = req.body;

    const updateData = {
      name,
      zise,
      color,
      price,
      status,
      image
    };

   
    const result = await Inventory.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json((result));
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error occurred" });
  }
};
 //  Delete user 

const deleteInventory = async(req , res) => {
  try {
    const id = req.params.id 
    const result = await Inventory.findByIdAndDelete(id);
    res.json(result);
    
  } catch (error) {

    res.status(500).json({ message: "Internal server error occurred" });
    
  };
};

const findByid = async(req , res) => {
  try {

    const id = req.params.id
    const result = await Inventory.findOne({id:id});
    res.json(result);
    
  } catch (error) {

    res.status(500).json({ message: "Internal server error occurred" });
    
  };
};
module.exports = { addInventory, getAllinventory , updateInventory, deleteInventory};

