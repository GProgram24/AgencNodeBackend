import express from "express";
import { sampleTesting } from "../controller/fastAPI/sampleTesting.controller.js";
import { makeIdea } from "../controller/fastAPI/makeIdea.controller.js";
import { brainstorming } from "../controller/fastAPI/brainstorming.controller.js";

const router = express.Router();

router.post("/sample", sampleTesting);
router.post("/idea", makeIdea);
router.post("/brainstorm", brainstorming);
router.post("/:others", (req, res) => {
  res.status(422).json({ message: "Invalid url" });
});

export default router;
