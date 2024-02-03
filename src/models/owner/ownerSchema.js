import mongoose from "mongoose";

const ownerSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
});

const Owners=mongoose.models.owners || mongoose.model("owners",ownerSchema);

export default Owners;