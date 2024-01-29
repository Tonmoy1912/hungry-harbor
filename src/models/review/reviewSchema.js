import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    itemId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items'
    },
    review:{
        type: String,
    },
    rating:{
        type:Number,
    }
});

const Reviews=mongoose.models.reviews || mongoose.model("reviews",reviewSchema);

export default Reviews;

// review:userid,itemid,review,rating