// This code has not been tested yet after integrating mongodb schema for saving the tokens. First test this code and then push to production.

import axios from "axios";
import dotenv from "dotenv";
import Token from "../../models/platformAccessToken.model.js"; // Import the Token model
dotenv.config();

export const handleLinkedInCallback = async (req, res) => {
  const { code } = req.query;
  console.log("LinkedIn callback received:", req.query);

  if (!code) {
    return res.status(400).json({ message: "Authorization code is missing" });
  }

  try {
    // Exchange authorization code for an access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token; // LinkedIn usually provides a refresh token here
    const expiresIn = tokenResponse.data.expires_in; // Expiry time in seconds
    const expiresAt = new Date(Date.now() + expiresIn * 1000); // Calculate the expiration date

    console.log("Access token obtained:", accessToken);

    // Save the token data to the database
    const userId = req.user._id; // Assuming `req.user` contains the authenticated user's ID
    const platform = "linkedin"; // Platform identifier

    // Upsert the token in the database (update if it exists, otherwise create a new one)
    await Token.findOneAndUpdate(
      { userId, platform }, // Search parameter for updating the collection
      {
        accessToken,
        refreshToken, // Store the refresh token
        expiresAt,
        platform,
        userId,
      },
      { upsert: true, new: true }
    );

    // Redirect to the frontend with success status
    res.redirect(
      `http://localhost:5173/integrate_platforms?status=success&platform=linkedin`
    );
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Server error during token exchange" });
  }
};
