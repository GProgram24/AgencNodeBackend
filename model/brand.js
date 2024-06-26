import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    user_id: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    created_by: { type: Number, required: true }
});

export default mongoose.model('Brand', brandSchema);
