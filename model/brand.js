const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    user_id: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    created_by: { type: Number, required: true }
});

module.exports = mongoose.model('Brand', brandSchema);
