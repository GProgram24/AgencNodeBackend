import express from "express";
// import { sampleTesting } from "../controller/fastAPI/sampleTesting.controller.js"; // to be moved to web socket
import { makeIdea } from "../controller/fastAPI/makeIdea.controller.js";

const router = express.Router();

// Generate content for make an idea feature
router.post("/idea", makeIdea);
// Handling invalid route for content
router.post("/:others", (req, res) => {
  res.status(422).json({ message: "Invalid url" });
});

export default router;
