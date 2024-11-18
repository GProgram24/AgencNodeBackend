import mongoose from "mongoose";

const contentPieceSchema = new mongoose.Schema({
    label: {
      type: String,
      required: true, // E.g., "Blog", "Social Media Post"
    },
    content: [
      {
        id: {
          type: Number,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
      },
    ],
  });
  
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
      contentPieces: [contentPieceSchema], // Array of content pieces with nested objects
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
  