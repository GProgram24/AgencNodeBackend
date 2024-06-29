import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import logger from "morgan";

import login from "./router/authentication/login.route.js";
import signup from "./router/authentication/signup.route.js";
import forgotPassword from "./router/authentication/forgotPassword.route.js";
import passwordReset from "./router/authentication/passwordReset.route.js";
import productServiceRoutes from "./router/productService.route.js";
import categoryRoutes from "./router/category.route.js";
import subBrandRoutes from "./router/subBrand.route.js";
import brandRoutes from "./router/brand.route.js";
import targetGroupRoutes from "./router/targetGroup.route.js";
import projectRoutes from "./router/project.route.js";
import userRoutes from "./router/user.route.js";
import productServiceMetaRoutes from "./router/productServiceMeta.route.js";
import targetAudienceRoutes from "./router/targetAudience.route.js";
import communicationGoalsRoutes from "./router/communicationGoal.route.js";
import userBrandRoutes from "./router/userBrand.route.js";
import userSectorRoutes from "./router/userSector.route.js";
import technologyRoutes from "./router/technology.route.js";
import sectorRoutes from "./router/sector.route.js";
import quarterRoutes from "./router/quarter.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://agenc-frontend.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

// Middleware
app.use(bodyParser.json());
app.use(logger("dev"));

// To check server status
app.get("/", (req, res) => {
  res.json({ status: "running" });
})

app.use("/login", login);
app.use("/signup", signup);
app.use("/forgot-password", forgotPassword);
app.use("/password-reset", passwordReset);
app.use("/product-services", productServiceRoutes);
app.use("/categories", categoryRoutes);
app.use("/sub-brands", subBrandRoutes);
app.use("/brands", brandRoutes);
app.use("/target-groups", targetGroupRoutes);
app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/product-service-metas", productServiceMetaRoutes);
app.use("/target-audiences", targetAudienceRoutes);
app.use("/communication-goals", communicationGoalsRoutes);
app.use("/user-brands", userBrandRoutes);
app.use("/user-sectors", userSectorRoutes);
app.use("/technologies", technologyRoutes);
app.use("/sectors", sectorRoutes);
app.use("/quarters", quarterRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Failed to connect to MongoDB", err));


