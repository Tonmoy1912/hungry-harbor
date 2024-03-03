import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    items:[{
        item:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'items'
        },
        quantity:{
            type: Number,
            default: 1
        }
    }],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

const Carts=mongoose.models.carts || mongoose.model("carts",cartSchema);

export default Carts;

// Cart:item_id:[],total_price,userid,