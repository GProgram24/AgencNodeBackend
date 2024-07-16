import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  onboardingProgress: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Custodian",
    required: false,
  }
},
  {
    timestamps: true

  });

export default mongoose.model("Creator", creatorSchema);