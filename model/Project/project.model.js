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
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
