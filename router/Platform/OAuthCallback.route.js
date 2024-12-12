// /routes/oauthRoutes.js
import express from "express";
import { handleLinkedInCallback } from "../../controller/platform/OAuthCallback/linkedAuthCallback.controller.js";
import { handleMailchimpCallback } from "../../controller/platform/OAuthCallback/mailchimpAuthCallback.controller.js";

const router = express.Router();

// LinkedIn OAuth callback route
router.get("/linkedin/callback", handleLinkedInCallback);

// LinkedIn OAuth callback route
router.get("/mailchimp/callback", handleMailchimpCallback);

export default router;
