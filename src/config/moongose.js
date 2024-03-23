import mongoose from "mongoose";

export async function mongoConnect() {
    try {
        if (mongoose.connection && mongoose.connection.readyState == 1) {
            // console.log("DB is connceted.");
        }
        else {
            // console.log("DB is not connected");
            await mongoose.connect(process.env.MONGO_URL);
        }
    }
    catch (err) {
        console.log("error in mongo connect", err.message);
    }
}