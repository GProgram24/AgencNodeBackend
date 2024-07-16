import mongoose from "mongoose";

const subBrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    subCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductService" }],
  },
  { timestamps: true }
);

export default mongoose.model("SubBrand", subBrandSchema);
