const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const quarterSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    userId: { type: Number, required: true }
});

module.exports = mongoose.model('QuarterGoal', quarterSchema);
