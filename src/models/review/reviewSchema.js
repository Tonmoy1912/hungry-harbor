import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items'
    },
    review:{
        type: String,
        require:true
    },
    rating:{
        type:Number,
        default:5,
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const Reviews=mongoose.models.reviews || mongoose.model("reviews",reviewSchema);

export default Reviews;

// review:userid,itemid,review,rating