import mongoose from "mongoose";

const productServiceMetaSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  productService: { type: Number, required: true },
  description: { type: String, required: true },
  feature: { type: String, required: true },
  attributes: { type: String, required: true },
  usp: { type: String, required: true },
  userId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Number, required: true },
});

export default mongoose.model("ProductServiceMeta", productServiceMetaSchema);
