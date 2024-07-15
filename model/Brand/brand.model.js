import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subBrands: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubBrand" }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    subCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    ],
    managedBy: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: "creators" },
    accountId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "accounts" },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductService" }],
  },
  { timestamps: true }
);

export default mongoose.model("brand", brandSchema);
