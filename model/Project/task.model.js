import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "created",
        "pending_approval",
        "editing_required",
        "approved",
        "published",
      ],
      default: "created",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vettedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductService",
      required: true,
    },
    targetAudience: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TargetAudience",
      required: true,
    },
    idea: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
