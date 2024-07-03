import mongoose from "mongoose";

const { Schema } = mongoose;

// Define the Sub-Category Schema
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "ProductService",
      },
    ],
  },
  { timestamps: true }
);

// Create and export the Sub-Category model
const SubCategory = mongoose.model("SubCategory", subCategorySchema);

export default SubCategory;
