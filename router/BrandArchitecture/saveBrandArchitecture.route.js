import express from "express";
import { saveBrandArchitecture } from "../../controller/BrandArchitecture/saveBrandArchiecture.controller.js";

const router = express.Router();

router.post("/save-brand", saveBrandArchitecture);

export default router;
