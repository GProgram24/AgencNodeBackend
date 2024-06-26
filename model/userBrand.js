import mongoose from "mongoose";

const userBrandSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    brandId: { type: Number, required: true },
    userId: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Number, required: true }
});

export default mongoose.model('UserBrand', userBrandSchema);
