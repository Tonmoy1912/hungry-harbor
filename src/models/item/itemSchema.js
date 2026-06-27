import mongoose from "mongoose";

export const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String,
        default: "https://hungryharbor.blob.core.windows.net/public/no-image.jpg",
        require: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    removed: {
        type: Boolean,
        default: false
    },
    category_order: {
        type: Number,
        default: 1000
    },
    global_order: {
        type: Number,
        default: 1000
    },
    in_stock: {
        type: Number,
        default: 0
    },
    total_review: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0.0
    }
});

const Items = mongoose.models.items || mongoose.model("items", itemSchema);

export default Items;

// Item:name,image,description,price,category,date