import mongoose from "mongoose";

const productServiceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  category_id: { type: Number, required: true },
  name: { type: String, required: true },
  user_id: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  created_by: { type: Number, required: true },
});

export default mongoose.model("ProductService", productServiceSchema);
