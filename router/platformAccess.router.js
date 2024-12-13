import express from "express";
import { platformResponse } from "../controller/platform/platformAccess.controller.js";
import { getUrl } from "../controller/platform/getPlatformUrl.controller.js";
import { getPlatform, addPlatform } from "../controller/platform/addPlatform.controller.js";

const router = express.Router();

router.get("/available", getPlatform); // To send available platforms to frontend
router.get("/access/:platformName", platformResponse); // redirect url specified on platforms
router.get("/url", getUrl); // To create url for accessing platforms
router.post("/add", addPlatform); // To add developer data for accessing platforms. Only for development purpose
router.post("/:others", (req, res) => {
  res.status(422).json({ message: "Invalid url" });
});

export default router;
