import express from "express";
import { setupCreator } from "../../controller/BrandArchitecture/setupCreator.Controller.js";

const router = express.Router();

router.post("/:accountType", setupCreator);

export default router;
