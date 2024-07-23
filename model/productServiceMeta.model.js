import mongoose from "mongoose";

const productServiceMetaSchema = new mongoose.Schema({
  productServiceId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "ProductService" },
  description: { type: String, required: true },
  feature: { type: String, required: true },
  attributes: { type: String, required: true },
  usp: { type: String, required: true }
},
  { timestamps: true }
);

export default mongoose.model("ProductServiceMeta", productServiceMetaSchema);
