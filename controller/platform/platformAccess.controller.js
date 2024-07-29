// import database model for storing access and refresh token

import { google } from "googleapis";

export const getAccess1 = (req, res) => {
    console.log(req.body);
    return res.status(200).json({ message: "Post platform access controller" });
}

export const getAccess2 = async (req, res) => {
    const oauth2Client = new google.auth.OAuth2(
        "609588380681-0qll1hghsj50diu705up817qq59pivd3.apps.googleusercontent.com",
        "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",
        "http://localhost:8000/api/platform/access"
    );

    const { code } = req.query;
    console.log(code);
    try {
        const { tokens } = await oauth2Client.getToken(code);

        // Here you can save tokens.access_token and tokens.refresh_token to your database

        res.json(tokens);
    } catch (error) {
        console.error('Error exchanging authorization code for tokens:', error);
        res.status(500).json({ error: 'Failed to get tokens' });
    };
}
