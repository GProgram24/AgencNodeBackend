import dotenv from "dotenv";
dotenv.config();

export const generateOAuthURL = (req, res) => {
  const { platform } = req.params;
  const { userId } = req.body; // Access the userId from the request body
  // console.log("Request Body:", req.body);

  // Log the userId to ensure it's passed correctly
  // console.log("User ID received:", userId);
  // console.log(process.env.LINKEDIN_REDIRECT_URI);
  // console.log(process.env.MAILCHIMP_REDIRECT_URI);

  // Continue with your logic for generating the OAuth URL
  let oauthURL = "";
  let clientId = "";
  let redirectUri = "";

  switch (platform) {
    case "instagram":
      clientId = process.env.INSTAGRAM_CLIENT_ID;
      redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
      oauthURL = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code`;
      break;
    case "facebook":
      clientId = process.env.FACEBOOK_CLIENT_ID;
      redirectUri = process.env.FACEBOOK_REDIRECT_URI;
      oauthURL = `https://www.facebook.com/v11.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=email,public_profile&response_type=code`;
      break;
    case "twitter":
      clientId = process.env.TWITTER_CLIENT_ID;
      redirectUri = process.env.TWITTER_REDIRECT_URI;
      oauthURL = `https://api.twitter.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=tweet.read,tweet.write&response_type=code`;
      break;
    case "linkedin":
      clientId = process.env.LINKEDIN_CLIENT_ID;
      redirectUri = process.env.LINKEDIN_REDIRECT_URI;
      oauthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=rw_ads&state=${userId}`;
      break;
    case "mailchimp":
      clientId = process.env.MAILCHIMP_CLIENT_ID;
      redirectUri = process.env.MAILCHIMP_REDIRECT_URI;
      oauthURL = `https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${userId}`;
      break;

    default:
      return res.status(400).json({ message: "Unsupported platform" });
  }

  res.status(200).json({ oauthURL });
};
