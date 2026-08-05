const mongoose = require("mongoose");
const  userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,

    },

    phone:{
        type:Number,
        required: true,
    },
    email:{
        type:String,
        required: true
    },
     password:{
        type:String,
        required: true
    },
    role: {
    type: String,
    enum: ["admin", "staff"],
    default: "staff",
    required: true,
  },
  status:{
    type:String,
    enum: ["active", "inactive"],
    default:"active"
  }

}, 
{
    timestamps:true
});

module.exports = mongoose.model("Users", userSchema);