import dotenv from "dotenv";
dotenv.config();

export const generateOAuthURL = (req, res) => {
  console.log(process.env.LINKEDIN_REDIRECT_URI);

  const { platform } = req.params;
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
      oauthURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=rw_ads`;
      break;

    default:
      return res.status(400).json({ message: "Unsupported platform" });
  }

  res.status(200).json({ oauthURL });
};
