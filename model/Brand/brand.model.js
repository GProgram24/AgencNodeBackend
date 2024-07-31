import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    subBrands: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubBrand" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    subCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductService" }],
    accountId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Account" },
    managedBy: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: "Creator" }
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);
