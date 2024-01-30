import mongoose from "mongoose";

export const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    image:{
        type: String,
        require:true
    },
    description:{
        type: String
    },
    price:{
        type:Number,
        require:true
    },
    category:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    },
    total_review:{
        type:Number,
        default:0
    },
    rating:{
        type: Number,
        default: 0.0
    }
});

const Items=mongoose.models.itmes || mongoose.model("items",itemSchema);

export default Items;

// Item:name,image,description,price,category,date