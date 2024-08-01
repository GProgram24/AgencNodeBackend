import express from "express";
import { sampleTesting } from "../controller/fastAPI/sampleTesting.controller.js";

const router = express.Router();

router.post("/sample", sampleTesting);
router.post("/brainstorm");
router.post("/:others", (req, res) => {
  res.status(422).json({ message: "Invalid url" });
});

export default router;
