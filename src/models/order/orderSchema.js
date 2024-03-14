import mongoose from "mongoose";
import { itemSchema } from "../item/itemSchema";

const orderSchema = new mongoose.Schema({
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'items'
        },
        quantity: {
            type: Number,
            require: true
        }
    }],
    orderId: {
        type: String,
        default: null
    },
    paymentId: {
        type: String,
        default: null
    },
    refundId:{
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now
    },
    total_amount: {
        type: Number,
        require: true,
        default: 0
    },
    paid: {
        type: Boolean,
        default: false
    },
    payment_failed: {
        type: Boolean,
        default: false
    },
    refunded:{
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
    cooking_instruction:{
        type: String
    }
});

const Orders = mongoose.models.orders || mongoose.model("orders", orderSchema);

export default Orders;

// Order:items:[],date,total_price,userid,