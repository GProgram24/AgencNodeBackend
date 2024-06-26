const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: Number, required: true },
  communicationGoal: { type: Number, required: true },
  communicationTouchpoint: { type: Number, required: true },
  targetGroup: { type: Number, required: true },
  quarter: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  userId: { type: Number, required: true },
});

module.exports = mongoose.model("Project", projectSchema);
