import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
      enum: ["custodian", "creator", "editor", "viewer"],
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
