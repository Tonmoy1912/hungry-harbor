import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category:{
        type: String,
        require:true
    },
    total:{
        type: Number,
        default: 0
    }
});

const Categories=mongoose.models.categories || mongoose.model("categories",categorySchema);

export default Categories;

// Item:name,image,description,price,category,date