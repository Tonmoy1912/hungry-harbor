import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items'
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        require:true
    }
});

const WishLists=mongoose.models.wish_lists || mongoose.model("wish_lists",wishListSchema);

export default WishLists;

// WishList:item_id:[],userid,name