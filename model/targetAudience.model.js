import mongoose from "mongoose";

const targetAudienceData = new mongoose.Schema({
  name: { type: String, required: true },
  lowerAge: { type: Number, required: true },
  upperAge: { type: Number, required: true },
  goalsAndNeeds: { type: String, required: true },
  painPoints: { type: String, required: true },
  region: { type: String, required: true }
});

const targetAudienceSchema = new mongoose.Schema({
  productServiceId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: "ProductService" },
  targetAudience: [{ type: targetAudienceData, required: true }],

},
  { timestamps: true }
);

export default mongoose.model('TargetAudience', targetAudienceSchema);