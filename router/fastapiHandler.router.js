import express from "express";
import { sampleTesting } from "../controller/fastAPI/sampleTesting.controller.js";
import { makeIdea } from "../controller/fastAPI/makeIdea.controller.js";

const router = express.Router();

router.post("/sample", sampleTesting);
router.post("/idea", makeIdea);
router.post("/brainstorm");
router.post("/:others", (req, res) => {
  res.status(422).json({ message: "Invalid url" });
});

export default router;
