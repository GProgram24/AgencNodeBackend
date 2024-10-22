import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const restrictLiteAccountMiddleware = () => {
  return (req, res, next) => {
    try {
      // Get token from headers
      const token = req.headers.authorization?.split(" ")[1];
      console.log("Received token: ", token);

      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token not provided" });
      }

      // Verify and decode token
      const decodedToken = jwt.verify(token, SECRET_KEY);

      // Check account type; allow access for both Lite and Pro
      if (
        decodedToken.accountType !== "lite" &&
        decodedToken.accountType !== "pro"
      ) {
        return res.status(403).json({ message: "Invalid account type." });
      }

      // Attach accountType and user details to req for further processing
      req.user = {
        accountType: decodedToken.accountType,
        userId: decodedToken.userId, // Assuming userId is part of the token
      };

      next();
    } catch (error) {
      console.error("Error during token verification:", error);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
