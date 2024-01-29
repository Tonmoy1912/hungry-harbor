import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
    name:{
        type:String,
        require: true
    },
    itemIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items'
    }],
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

const WishLists=mongoose.models.wish_lists || mongoose.model("wish_lists",wishListSchema);

export default WishLists;

// WishList:item_id:[],userid,name