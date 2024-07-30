import mongoose from "mongoose";

const targetAudienceData = new mongoose.Schema({
    name: { type: String, required: true },
    lowerAge: { type: Number, required: true },
    upperAge: { type: Number, required: true },
    goalsAndNeeds: { type: String, required: true },
    painPoints: { type: String, required: true },
    region: { type: String, required: true }
});

const sampleTestingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: "User" },
    productCombination: [
        {
            type: {
                productId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true, ref: "ProductService" },
                targetAudience: { type: targetAudienceData, required: true },
                platform: { type: String, required: true }
            },
            required: true
        }
    ]
},
    { timestamps: true }
);

export default mongoose.model('SampleTesting', sampleTestingSchema);