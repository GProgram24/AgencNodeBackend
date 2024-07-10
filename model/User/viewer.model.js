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

const viewerModel = mongoose.model("viewer", viewerSchema);

export default viewerModel;