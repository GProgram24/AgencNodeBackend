import mongoose from "mongoose";
  
  const creationSchema = new mongoose.Schema(
    {
      idea: {
        type: String,
        required: true,
      },
      inputs: {
        targetAudience: {
          type: String,
          required: true,
        },
        tone: {
          type: String,
          required: true,
        },
        touchpoint: {
          type: String,
          required: true,
        },
        product: {
          type: String,
          required: true,
        },
        goal: {
          type: String,
          required: true,
        },
      },
      creatorId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
      contentPieces: [],
      createdAt: {
        type: Date,
        default: Date.now,
        expires: "30d", // Automatic document expiration
      },
    },
    {
      timestamps: true,
    }
  );
  
  export default mongoose.model("Creations", creationSchema);
  