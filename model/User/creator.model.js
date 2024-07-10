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
    ref: "users",
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "custodians",
    required: true,
  }
},
  {
    timestamps: true

  });

const creatorModel = mongoose.model("creator", creatorSchema);

export default creatorModel;