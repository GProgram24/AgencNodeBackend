import crypto from "crypto";
import { googleUrl } from "./google.controller.js";
import oAuthClientCredentials from "../../model/platform/oAuthClientCredentials.model.js";

export const getUrl = async (req, res) => {
    // Generate a secure random state value.
    const state = crypto.randomBytes(32).toString('hex');

    const platform = req.query.platform;
    console.log(platform);
    // If request for google ads url
    if (platform == "googleAds") {
        const clientDetail = await oAuthClientCredentials.findOne({ platform: "googleAds" });
        googleUrl(req, res, clientDetail.clientId, clientDetail.clientSecret, clientDetail.redirectURL, state, clientDetail.accessType, clientDetail.scope);
    }
    else {
        return res.json({ message: "Integration not available yet" });
    }
}

