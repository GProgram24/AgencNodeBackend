import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    active: { type: Boolean, default: true }
},
    {
        timestamps: true
    });

export default mongoose.model("Account", accountSchema);