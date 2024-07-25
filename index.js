// import "./instrument.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import logger from "morgan";
// import * as Sentry from "@sentry/node";

import authRouter from "./router/authentication/auth.route.js";
import setCreator from "./router/BrandArchitecture/setupCreator.route.js";
import setCustodian from "./router/BrandArchitecture/setupCustodian.route.js";
import setEditorViewer from "./router/BrandArchitecture/setupEditorViewer.route.js";
import checkAvailability from "./router/checkAvailability.route.js";
import brandHierarchy from "./router/BrandArchitecture/brandArchitecture.route.js";
import productSetup from "./router/BrandArchitecture/productDetails.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Optional fallthrough error handler
// app.use(function onError(err, req, res, next) {
//   // The error id is attached to `res.sentry` to be returned
//   // and optionally displayed to the user for support.
//   res.statusCode = 500;
//   res.end(res.sentry + "\n");
// });

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
app.use("/api/assign-role", setEditorViewer);
app.use("/api/check", checkAvailability);
app.use("/api/brand", brandHierarchy);
app.use("/api/product", productSetup);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // The error handler must be registered before any other error middleware and after all controllers
    // Sentry.setupExpressErrorHandler(app);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("Failed to connect to MongoDB", err));
