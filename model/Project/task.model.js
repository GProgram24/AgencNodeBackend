import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    finalContent: {
      type: String,
      default: null,
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
    touchpoint: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      required: true,
    },
    viewerComment: {
      type: String,
      default: null,
    },
    viewerCommentDate: {
      type: Date,
      default: null,
    },
    editorComment: {
      type: String,
      default: null,
    },
    editorCommentDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
