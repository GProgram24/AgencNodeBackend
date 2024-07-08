import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subBrands: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubBrand" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    subCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductService" }],
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);
