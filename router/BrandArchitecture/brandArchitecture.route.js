import express from "express";
import { saveBrandArchitecture } from "../../controller/BrandArchitecture/saveBrandArchitecture.controller.js";
import { fetchBrandHierarchy } from "../../controller/BrandArchitecture/getBrandArchitecture.controller.js";

const router = express.Router();

router.post("/save-hierarchy", saveBrandArchitecture);
router.post("/get-hierarchy", fetchBrandHierarchy);

export default router;
