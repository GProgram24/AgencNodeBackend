import express from "express";
import { getAccess1, getAccess2 } from "../controller/platform/platformAccess.controller.js";
import { getUrl } from "../controller/platform/getPlatformUrl.controller.js";
import { addPlatform } from "../controller/platform/addPlatform.controller.js";

const router = express.Router();

router.post("/access", getAccess1); // redirect urls on platform
router.get("/access", getAccess2); // redirect urls on platform
router.get("/url", getUrl); // To create url for accessing platforms
router.post("/add", addPlatform); // To add developer data for accessing platforms
router.post("/:others", (req, res) => {
  res.status(422).json({ message: "Invalid request" });
});

export default router;
