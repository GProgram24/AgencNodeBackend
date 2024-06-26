const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    id: { type: Number, required: true, unique: true },
    sub_brand_id: { type: Number, required: true },
    name: { type: String, required: true },
    is_child_category: { type: String, required: true },
    parent_id: { type: Number, required: true },
    user_id: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    created_by: { type: Number, required: true }
});

module.exports = mongoose.model('Category', categorySchema);
