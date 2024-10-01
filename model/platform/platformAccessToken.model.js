const platformAccessTokenSchema = new mongoose.Schema({
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
  accessToken: { type: String, required: true },
  refreshToken: { type: String },
  expiresAt: { type: Date },
  scope: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Compound index for efficient querying
platformAccessTokenSchema.index({ userId: 1, platform: 1 }, { unique: true });

const Token = mongoose.model("Token", platformAccessTokenSchema);
