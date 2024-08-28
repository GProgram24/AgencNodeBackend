import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: []
    }],
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the creator who manages the project
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
