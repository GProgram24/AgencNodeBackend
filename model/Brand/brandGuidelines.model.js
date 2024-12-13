import mongoose from "mongoose";

const BrandGuidelinesSchema = new mongoose.Schema(
    {
        brandId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true
        },
        brandMessage: {
            type: String,
            required: true
        },
        toneOfVoice: {
            description: {
                type: String,
                required: true
            },
            tones: {
                type: Map, // Use Map to allow dynamic key-value pairs
                of: Object // Values can be of any type (string, object, etc.)
            }
        },
        colorDescription: {
            type: String,
            required: true
        },
        socialMediaGuidelines: {
            recommendedHashtags: {
                type: [String],
                default: []
            },
            toneForPost: {
                type: String,
                default: ""
            }
        },
        additionalNotes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("BrandGuidelines", BrandGuidelinesSchema);
