import mongoose from "mongoose";

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
        default: null,
        index: true
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
        type: String,
        default:""
    },
    cooking_inst_status:{
        type:String,
        default: "pending"// pending, accepted, rejected
    },
    status:{
        type:String,
        default:"pending"// pending, accepted,  cancelled, delivered, ready
    },
    active:{
        type: String,
        enum: ["initialized", "active", "settled", "expired", "failed"],
        default:"initialized",
        index: true
    },
    expiresAt: {
        type: Date,
        default: null,
        index: true
    },
    ready_by:{
        type: String
    }
});

// Compound index for fast cron job lookups
orderSchema.index({ active: 1, expiresAt: 1 });

//active=active and paid=false --> cash on delivery

//active attribute
//when order is created active=initialized, when user paid for the order online it's active=active
//but in case of cash of delivery active=active by default
// when the order is either delivered or cancelled active=settled 

const Orders = mongoose.models.orders || mongoose.model("orders", orderSchema);

export default Orders;

// Order:items:[],date,total_price,userid,