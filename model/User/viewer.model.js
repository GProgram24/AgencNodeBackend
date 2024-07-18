import mongoose from "mongoose";

const viewerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: [{type:String}],
    required: true,
    enum: ["longform","performance","automation","community"]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Creator",
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  }
},
  {
    timestamps: true

  });

export default mongoose.model("Viewer", viewerSchema);