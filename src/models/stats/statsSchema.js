import mongoose from "mongoose";

const statsSchema=new mongoose.Schema({
    sells:{
        type: Number,
        require: true
    },
    orders_placed:{
        type: Number,
        require: true
    },
    orders_cancelled:{
        type: Number,
        require: true
    },
    date: {
        type:Date,
        require: true
    }
});

const Stats=mongoose.models.stats || mongoose.model("stats",statsSchema);

export default Stats;