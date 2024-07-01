import mongoose from "mongoose";

const targetGroupSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: Number, required: true }
});

export default mongoose.model('TargetGroup', targetGroupSchema);