import mongoose from "mongoose";
import { itemSchema } from "../item/itemSchema";

const orderSchema = new mongoose.Schema({
    items:[{
        type: itemSchema
    }],
    date:{
        type: Date,
        default: Date.now
    },
    total_price:{
        type: Number,
        require:true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

const Orders=mongoose.models.orders || mongoose.model("orders",orderSchema);

export default Orders;

// Order:items:[],date,total_price,userid,