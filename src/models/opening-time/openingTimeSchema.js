import mongoose from "mongoose";

const openingTimeSchema = new mongoose.Schema({
    date:{
        type: Date,
        default: Date.now
    }
});

const OpeningTimes=mongoose.models.openingtimes || mongoose.model("openingtimes",openingTimeSchema);

export default OpeningTimes;