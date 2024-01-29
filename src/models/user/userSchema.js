import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone:{
        type:String
    },
    address:{
        type:String
    },
    date: {
        type: Date,
        default: Date.now
    },
    total_order:{
        type: Number,
        default:0
    },
    isAdmin:{
        type: Boolean,
        default:false
    },
    avatar:{
        type:String
    },
    total_review:{
        type:Number,
        default:0
    },
    rating:{
        type: Number,
        default: 0.0
    }
});

const Users=mongoose.models.users || mongoose.model("users",userSchema);

export default Users;