import express from "express";
import { saveBrandArchitecture } from "../../controller/BrandArchitecture/saveBrandArchitecture.controller.js";
import { fetchBrandHierarchy } from "../../controller/BrandArchitecture/getBrandArchitecture.controller.js";
import { addSector } from "../../controller/BrandArchitecture/saveSector.controller.js";

const router = express.Router();

router.post("/save-hierarchy", saveBrandArchitecture);
router.post("/get-hierarchy", fetchBrandHierarchy);
router.post("/sector", addSector);

export default router;
