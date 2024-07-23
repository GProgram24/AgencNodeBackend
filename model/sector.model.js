import mongoose from "mongoose";

const sectorSchema = new mongoose.Schema({
  productServiceId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "ProductService" },
  name: {
    type: String,
    required: true,
    enum: ["Technology",
      "Consumer Goods",
      "Healthcare",
      "Food and Beverage",
      "Entertainment and Media",
      "Automotive",
      "Finance and Banking",
      "Education"]
  },
  subSector: [{ type: String, required: true }],
},
  { timestamps: true }
);

export default mongoose.model("Sector", sectorSchema);
