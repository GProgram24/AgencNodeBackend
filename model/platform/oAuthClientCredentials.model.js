import mongoose from "mongoose";

const oauthCredentialsSchema = new mongoose.Schema({
    platform: { type: String, required: true, unique: true },
    clientId: { type: String, required: true },
    clientSecret: { type: String, required: true },
    authURL: { type: String, required: true },
    scope: { type: [String], default: [] },
    tokenURL: { type: String, default: "" },
    accessType: { type: String, default: "offline" },
    redirectURL: { type: String, default: "http://localhost:8000/api/platform/access" },
    responseType: { type: String, default: "code" }
},
    { timestamps: true }
);

export default mongoose.model('OAuthCredential', oauthCredentialsSchema);
