// This schema has not been tested yet. First test and then use it.
import mongoose from "mongoose";

const platformAccessTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Creator",
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["linkedin", "facebook", "twitter", "instagram"],
    },
    accessToken: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
      trim: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    scope: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Compound index for efficient querying
platformAccessTokenSchema.index({ userId: 1, platform: 1 }, { unique: true });
platformAccessTokenSchema.index({ expiresAt: 1 }); // Index for token expiration

const Token = mongoose.model("Token", platformAccessTokenSchema);

export default Token;
