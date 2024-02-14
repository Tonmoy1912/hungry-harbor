import mongoose from "mongoose";

export const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    image:{
        type: String,
        default:"https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/items%2Fimage-not-found.png?alt=media&token=4eedd79c-8d24-4a5f-a505-1dd3f28fbc4d",
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
        require:true
    },
    date:{
        type: Date,
        default: Date.now
    },
    removed:{
        type:Boolean,
        default:false
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

const Items=mongoose.models.items || mongoose.model("items",itemSchema);

export default Items;

// Item:name,image,description,price,category,date