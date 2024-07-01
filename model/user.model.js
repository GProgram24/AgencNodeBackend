import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  userType: {
    type: Number,
    required: true,
  },
  completedSteps: {
    type: Number,
    required: false,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brand",
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userModel = mongoose.model("user", userSchema);

export default userModel;