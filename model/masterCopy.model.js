import mongoose from "mongoose";

const masterCopySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ProductService",
    }, // Reference to the product
    masterCopy: {
      type: String,
      required: true,
    }, // Finalized content (MasterCopy)
    targetAudienceName: {
      type: String,
      required: true,
    }, // Target audience name
    verticalName: {
      type: String,
      required: true,
    }, // Vertical the content belongs to (e.g., community, performance)
    finalizedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    }, // User who finalized the content
    thresholdRating: {
      type: Number,
      required: true,
    }, // The rating at which the content was finalized
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MasterCopy", masterCopySchema);
