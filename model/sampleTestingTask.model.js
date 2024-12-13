import mongoose from "mongoose";

const targetAudienceData = new mongoose.Schema({
  name: { type: String, required: true },
  lowerAge: { type: Number, required: true },
  upperAge: { type: Number, required: true },
  goalsAndNeeds: { type: String, required: true },
  painPoints: { type: String, required: true },
  region: { type: String, required: true },
});

const sampleTestingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    task: {
      type: {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "ProductService",
        },
        productName: { type: String },
        targetAudience: { 
          type: targetAudienceData, 
          required: true 
        },
        brandTone:{
          type: String,
          required: true
        },
        goal:{
          type: String,
          required: true,
        }
      },
      required: true,
    },
    completed:{
      type: Boolean,
      required: true,
      default: false
    },
  },
  { timestamps: true }
);

export default mongoose.model("SampleTestingTask", sampleTestingSchema);
