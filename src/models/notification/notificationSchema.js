import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    message:{
        type: String,
        default:""
    },
    date:{
        type: Date,
        default: Date.now
    },
    is_read:{
        type: Boolean,
        default: false
    }
});

const Notifications=mongoose.models.notifications || mongoose.model("notifications",notificationSchema);

export default Notifications;

// Cart:item_id:[],total_price,userid,