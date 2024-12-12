// This code has not been tested yet after integrating mongodb schema for saving the tokens. First test this code and then push to production.

import axios from "axios";
import dotenv from "dotenv";
import Token from "../../../model/platform/platformAccessToken.model.js";
dotenv.config();

export const handleMailchimpCallback = async (req, res) => {
  const { code } = req.query;
  const userId = req.query.state; // Ensure the user ID is properly retrieved from req.user or req.body
  
  console.log("Mailchimp callback received:", req.query);

  if (!code || !userId) {
    return res.status(400).json({ message: "Authorization code or user ID is missing" });
  }

  try {
    // Exchange authorization code for an access token
    const tokenResponse = await axios.post(
      "https://login.mailchimp.com/oauth2/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.MAILCHIMP_REDIRECT_URI,
        client_id: process.env.MAILCHIMP_CLIENT_ID,
        client_secret: process.env.MAILCHIMP_CLIENT_SECRET,
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token || null; // Set to null if refreshToken is undefined
    const expiresIn = tokenResponse.data.expires_in; // Expiry time in seconds
    const expiresAt = new Date(Date.now() + expiresIn * 1000); // Calculate the expiration date

    console.log("Access token obtained:", accessToken);

    // Log the data before saving to the database
    console.log("Saving the following data to the database:");
    console.log({ userId, platform: "mailchimp", accessToken, refreshToken, expiresAt });

    // Save the token data to the database
    const platform = "mailchimp"; // Platform identifier

    // Upsert the token in the database (update if it exists, otherwise create a new one)
    const savedToken = await Token.findOneAndUpdate(
      { userId, platform }, // Search parameter for updating the collection
      {
        accessToken,
        refreshToken, // Store the refresh token (null if undefined)
        expiresAt,
        platform,
        userId,
      },
      { upsert: true, new: true }
    );

    console.log("Data saved successfully:", savedToken);

    // Redirect to the frontend with success status
    res.redirect(
      "http://localhost:5173/integrate_platforms?status=success&platform=mailchimp"
    );
  } catch (error) {
    console.error(
      "Error exchanging code for access token:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Server error during token exchange" });
  }
};