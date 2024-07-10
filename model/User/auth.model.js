import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    "email": { type: String, required: true, unique: true },
    "hash": { type: String, required: true, unique: true },
    "createdAt": { type: Date, default: Date.now, expires: 1800 },//expires in 30 minute
});

export default mongoose.model('auth', authSchema, 'auth');
