import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import logger from "morgan";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./router/authentication/auth.route.js";
import setCreator from "./router/BrandArchitecture/setupCreator.route.js";
import setCustodian from "./router/BrandArchitecture/setupCustodian.route.js";
import setEditorViewer from "./router/BrandArchitecture/setupEditorViewer.route.js";
import checkAvailability from "./router/checkAvailability.route.js";
import brandHierarchy from "./router/BrandArchitecture/brandArchitecture.route.js";
import productSetup from "./router/BrandArchitecture/productDetails.router.js";
import platformAccess from "./router/platformAccess.router.js";
import projectContentRoute from "./router/Project/projectContent.route.js";
import projectRoute from "./router/Project/project.route.js";
import { updateOnboardingProgress } from "./controller/misc/onboardingUpdate.function.js";
import fastAPIHandler from "./router/fastapiHandler.router.js";
import { getSampleTestingTask } from "./controller/misc/sampleTestingTask.function.js";
import websocketRoutes from "./router/WebSocket/websocket.route.js";
import oauthRoutes from "./router/Platform/OAuthConfigure.route.js";
import oauthCallbackRoutes from "./router/Platform/OAuthCallback.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// HTTP server created from the Express app
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:5500", "http://localhost:5173"],
  },
});

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
app.use("/api/projects", projectRoute);
app.use("/api/projects", projectContentRoute);
// to update onboarding progress, keep as last route
app.patch("/api/onboarding/progress", updateOnboardingProgress);
app.use("/api/oauth", oauthRoutes);
app.use("/api", oauthCallbackRoutes);
// web-socket
websocketRoutes(io);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Failed to connect to MongoDB", err));
