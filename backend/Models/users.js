const mongoose = require("mongoose");
const  userSchema = new mongoose.Schema({
    Name:{
        Type:String,
        require: true,

    },

    Phone:{
        type:Number,
        require: true,
    },
    Email:{
        type:String,
        require: true
    },
     Password:{
        type:String,
        require: true
    }




}, 
{
    timestamps:true
});

module.exports = mongoose.model("users", userSchema);