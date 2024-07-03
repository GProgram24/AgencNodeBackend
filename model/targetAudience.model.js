import mongoose from "mongoose";

const targetAudienceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  targetGroupName: { type: Number, required: true },
  age: { type: String, required: true },
  goalsAndNeeds: { type: String, required: true },
  painPoints: { type: String, required: true },
  region: { type: String, required: true },
  userId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Number, required: true }
});

export default mongoose.model('TargetAudience', targetAudienceSchema);