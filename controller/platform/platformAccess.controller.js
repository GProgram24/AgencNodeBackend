import oAuthClientCredentials from "../../model/platform/oAuthClientCredentials.model.js";
import { googleRedirect } from "./google.controller.js";

// For Google Ads
export const platformResponse = async (req, res) => {
    // Identify platform response is coming from // Or make separate route for platforms
    // Fetch ids from database
    // get state from the url and pass
    if (req.params.platformName == "googleads") {
        try {
            const clientDetail = await oAuthClientCredentials.findOne({ platform: "googleAds" });
            const state = "testing";
            await googleRedirect(req, res, clientDetail.clientId, clientDetail.clientSecret, clientDetail.redirectURL, state);
        } catch (error) {
            console.log("Error at google ads platform access:", error);
            res.status(500).json({ message: "Server error" });
        }
    } else {
        res.json({ message: "Not available yet" });
    }
}
