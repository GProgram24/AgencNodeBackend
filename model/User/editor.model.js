import mongoose from "mongoose";

const editorSchema = new mongoose.Schema({
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
    ref: "users",
    required: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "creators",
    required: true,
  }
},
  {
    timestamps: true

  });

export default mongoose.model("editor", editorSchema);