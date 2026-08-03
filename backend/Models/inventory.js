const moongose= require("mongoose")

const inventorySchema=new moongose.Schema({
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
    }
},
{
    timestamps:true
})

module.exports= mongoose.module("inventories", inventorySchema)