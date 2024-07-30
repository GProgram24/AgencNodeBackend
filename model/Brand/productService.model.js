import mongoose from "mongoose";

const productServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subBrand: { type: mongoose.Schema.Types.ObjectId, ref: "SubBrand" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    fileDataRefs: [{ type: mongoose.Schema.Types.ObjectId, ref: "FileData" }],
  },
  { timestamps: true }
);

export default mongoose.model("ProductService", productServiceSchema);
