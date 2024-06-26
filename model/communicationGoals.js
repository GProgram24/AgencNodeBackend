import mongoose from "mongoose";

const communicationGoalSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: Number, required: true },
});

export default mongoose.model("CommunicationGoal", communicationGoalSchema);
