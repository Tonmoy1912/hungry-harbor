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
    phone: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: Date.now
    },
    total_order: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: "https://hungryharbor.blob.core.windows.net/public/Profile.png"
    }
});

const Users = mongoose.models.users || mongoose.model("users", userSchema);

export default Users;