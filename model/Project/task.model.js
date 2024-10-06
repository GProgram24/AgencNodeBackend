import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const taskSchema = new mongoose.Schema(
  {
    promptId: {type: new mongoose.Schema.Types.ObjectId, required: true},
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
      ref: "Creator",
      required: true,
    },
    vettedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Viewer",
      default: null,
    },
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Editor",
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
    viewerComments: [commentSchema],
    editorComments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
