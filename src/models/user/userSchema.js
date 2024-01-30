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
        type:String,
        default:"https://firebasestorage.googleapis.com/v0/b/hungryharbor-412214.appspot.com/o/profile%2Fdefault-profile.png?alt=media&token=6de54cec-1899-498b-b0ec-9a1c1d2cbfb0"
    }
});

const Users=mongoose.models.users || mongoose.model("users",userSchema);

export default Users;