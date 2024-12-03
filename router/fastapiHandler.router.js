import express from "express";
// import { sampleTesting } from "../controller/fastAPI/sampleTesting.controller.js"; // to be moved to web socket
import { getAllCreations, makeIdea } from "../controller/fastAPI/makeIdea.controller.js";
import { checkCredits } from "../middleware/checkCredit.middleware.js";

const router = express.Router();

// Generate content for make an idea feature
router.post("/idea", checkCredits, makeIdea);
router.get("/creations/:creationId", getAllCreations)
// Handling invalid route for content
router.post("/:others", (req, res) => {
  res.status(422).json({ message: "Invalid url" });
});

export default router;
