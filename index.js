import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import logger from "morgan";

import authRouter from "./router/authentication/auth.route.js";
import setCreator from "./router/BrandArchitecture/setupCreator.route.js";
import setCustodian from "./router/BrandArchitecture/setupCustodian.route.js";
import setEditorViewer from "./router/BrandArchitecture/setupEditorViewer.route.js";
import checkAvailability from "./router/checkAvailability.route.js";
import brandHierarchy from "./router/BrandArchitecture/brandArchitecture.route.js";
import productSetup from "./router/BrandArchitecture/productDetails.router.js";
import platformAccess from "./router/platformAccess.router.js";
import taskCreation from "./router/Project/task.route.js";
import { updateOnboardingProgress } from "./controller/misc/onboardingUpdate.function.js";
import fastAPIHandler from "./router/fastapiHandler.router.js";
import { getSampleTestingTask } from "./controller/misc/sampleTestingTask.function.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://agenc-frontend.vercel.app",
];

// Middleware
app.use(bodyParser.json());
app.use(logger("dev"));
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

// To check server status
app.get("/", (req, res) => {
  res.json({ status: "running" });
});
app.use("/api/auth", authRouter);
app.use("/api/creator", setCreator);
app.use("/api/custodian", setCustodian);
app.use("/api/collaborator", setEditorViewer);
app.use("/api/check", checkAvailability);
app.use("/api/brand", brandHierarchy);
app.use("/api/product", productSetup);
app.use("/api/platform", platformAccess);
app.use("/api/content", fastAPIHandler);
app.post("/api/task", getSampleTestingTask);
app.use("/api/project", taskCreation);
// to update onboarding progress, keep as last route
app.patch("/api/onboarding/progress", updateOnboardingProgress);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // to keep free server up
    // Note: uncomment below code only when pushing on server, do not use on localhost
    // setInterval(async () => {
    //     const response = await fetch("https://agencnodebackend.onrender.com/");
    //     console.log(await response.json());
    // }, 600000)
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Failed to connect to MongoDB", err));
