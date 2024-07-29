import { google } from "googleapis";
import session from "express-session";

export const googleRedirect = async (req, res, clientId, clientSecret, redirectUrl, state) => {
    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUrl
    );

    // Verify state from the response
    console.log(state);

    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);
        const accessToken = tokens.access_token;
        const refreshToken = tokens.refresh_token;
        console.log(accessToken, refreshToken);
        res.status(200).json({ message: "Successful" });
    } catch (error) {
        console.error("Error exchanging authorization code for tokens:", error);
        res.status(500).json({ error: "Failed to get tokens" });
    };
}

export const googleUrl = (req, res, clientId, clientSecret, redirectUrl, state, accessType, scope) => {
    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUrl
    );

    // Store state in the session
    // req.session.state = state;
    console.log(state);

    // Generate a url that asks permissions
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: accessType,
        scope: scope,
        // For incremental authorization
        include_granted_scopes: true,
        // Include the state parameter to reduce the risk of CSRF attacks.
        state: state
    });

    return res.status(200).json({ message: authorizationUrl });
}