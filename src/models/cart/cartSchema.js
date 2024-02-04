import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items'
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

const Carts=mongoose.models.carts || mongoose.model("carts",cartSchema);

export default Carts;

// Cart:item_id:[],total_price,userid,