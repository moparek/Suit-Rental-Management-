const mongoose= require("mongoose")

const inventorySchema= new mongoose.Schema({
      name:{
        type:String,
        required: true,

    },
    zise:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
     price:{
        type:Number,
        required:true
    },
    status: {
        type: String,
        enum: [
            "available",
            "rental",
            "maintenance"
        ],
        required: true
    },

    image: {
        type: String,
        required: true
    }
},
{
    timestamps:true
})

module.exports = mongoose.model("Inventory", inventorySchema);