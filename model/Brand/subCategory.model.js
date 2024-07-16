import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductService" }],
  },
  { timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);
