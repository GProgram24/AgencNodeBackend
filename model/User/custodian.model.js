import mongoose from "mongoose";

const custodianSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "accounts",
    required: true,
    unique: true
  }
},
  {
    timestamps: true

  });

export default mongoose.model("custodian", custodianSchema);