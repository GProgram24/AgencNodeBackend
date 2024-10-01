import axios from "axios";
import dotenv from "dotenv";
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
    console.log("Access token obtained:", accessToken);

    // Here, you would typically save the token securely (e.g., in a database)
    // For now, we'll just send it back to the client
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
