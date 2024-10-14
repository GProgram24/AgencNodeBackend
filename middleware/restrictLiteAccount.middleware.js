import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const restrictLiteAccountMiddleware = () => {
  return (req, res, next) => {
    try {
      // Get token from headers
      const token = req.headers.authorization?.split(" ")[1];
      console.log("Recived token: ", token);

      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized, token not provided" });
      }

      // Verify and decode token
      const decodedToken = jwt.verify(token, SECRET_KEY);

      // Check account type; Pro accounts have access to everything
      if (decodedToken.accountType === "lite") {
        return res
          .status(403)
          .json({ message: "Access restricted. Please upgrade to AgenC Pro." });
      }

      next();
    } catch (error) {
      console.error("Error during token verification:", error);
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  };
};
