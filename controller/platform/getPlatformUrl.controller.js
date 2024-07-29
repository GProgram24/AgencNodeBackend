import crypto from "crypto";
import express from "express";
import session from "express-session";
import { google } from "googleapis";

export const getUrl = (req, res) => {
    const platform = req.query.platform;
    console.log(platform);
    const { clientId, clientSecret, authURL, scope, tokenURL, accessType, redirectURL, responseType } = req.body;
    console.log(clientId, clientSecret, authURL, scope, tokenURL, accessType, redirectURL, responseType);

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectURL
    );

    // Generate a secure random state value.
    const state = crypto.randomBytes(32).toString('hex');
    console.log(state);
    // Store state in the session
    // req.session.state = state;

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

