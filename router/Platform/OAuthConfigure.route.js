// /routes/oauthRoutes.js
import express from "express";
import { generateOAuthURL } from "../../controller/platform/OAuthConfigure.controller.js";

const router = express.Router();

// Route to get the OAuth URL for the specified platform
router.get("/:platform", generateOAuthURL);

export default router;
