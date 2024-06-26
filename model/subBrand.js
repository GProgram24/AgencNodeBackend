const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subBrandSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    brandId: { type: Number, required: true },
    name: { type: String, required: true },
    userId: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Number, required: true }
});

module.exports = mongoose.model('SubBrand', subBrandSchema);
