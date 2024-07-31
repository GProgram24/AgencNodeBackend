import mongoose from "mongoose";

const userTokensSchema = new mongoose.Schema({
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    platform: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresIn: { type: Date, required: true },
},
    { timestamps: true }
);

export default mongoose.model('UserToken', userTokensSchema);
