import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Number, required: true },
  completedSteps: { type: Number, required: true },
  userType: { type: Number, required: true },
  parentId: { type: Number, required: true },
  brandId: { type: Number, required: true },
  createdBy: { type: Number, required: true }
});

export default mongoose.model('user', userSchema);