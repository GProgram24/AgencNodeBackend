import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  subBrandId: { type: Number, required: true },
  name: { type: String, required: true },
  isChildCategory: { type: String, required: true },
  parentId: { type: Number, required: true },
  userId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Number, required: true },
});

export default mongoose.model("Category", categorySchema);
