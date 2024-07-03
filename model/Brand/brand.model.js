import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    subBrands: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubBrand",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Brand", brandSchema);
