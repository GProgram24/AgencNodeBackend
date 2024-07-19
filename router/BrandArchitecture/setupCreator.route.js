import express from "express";
import { setupCreator } from "../../controller/authentication/setupCreator.Controller.js";

const router = express.Router();

router.post("/", setupCreator);

export default router;
