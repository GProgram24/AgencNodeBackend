const mongoose = require('mongoose');

const targetGroupSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: Number, required: true }
});

module.exports = mongoose.model('TargetGroup', targetGroupSchema);