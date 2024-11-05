// /routes/oauthRoutes.js
import express from "express";
import { handleLinkedInCallback } from "../../controller/platform/OAuthCallback/linkedAuthCallback.controller.js";

const router = express.Router();

// LinkedIn OAuth callback route
router.get("/linkedin/callback", handleLinkedInCallback);

export default router;
