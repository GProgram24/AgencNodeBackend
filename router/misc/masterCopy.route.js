import express from "express";
import {
  createMasterCopy,
  getMasterCopy,
} from "../../controller/fastAPI/masterCopy.controller.js";

const router = express.Router();

router.post("/", createMasterCopy);

router.get("/single", getMasterCopy);

export default router;
