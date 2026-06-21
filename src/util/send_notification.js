import mongoose from "mongoose";
import Notifications from "@/models/notification/notificationSchema";
import Users from "@/models/user/userSchema";
import { sendEventToSocketServer } from "@/util/send_event";

export async function sendNotiToSocketServerAndSave(data) {//data={userId,message,is_read,for_owner}
    try {
        await mongoose.connect(process.env.MONGO_URL);
        if (data.for_owner) {
            const developer = await Users.findOne({ email: process.env.DEVELOPER }).select({ _id: 1 });
            const newNoti = new Notifications({ user: developer._id, message: data.message, is_read: data.is_read, for_owner: true });
            await newNoti.save();
        }
        else {
            const newNoti = new Notifications({ user: data.userId, message: data.message, is_read: data.is_read, for_owner: false });
            await newNoti.save();
        }
        sendEventToSocketServer("/api/notification/send-notification", { ...data });
    }
    catch (err) {
        console.log("Failed to send notification to socket server", err.message);
    }
}