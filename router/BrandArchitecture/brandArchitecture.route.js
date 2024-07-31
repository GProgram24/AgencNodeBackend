import express from "express";
import { saveBrandArchitecture } from "../../controller/BrandArchitecture/saveBrandArchitecture.controller.js";
import { fetchBrandHierarchy } from "../../controller/BrandArchitecture/getBrandArchitecture.controller.js";
import { addSector } from "../../controller/BrandArchitecture/saveSector.controller.js";
import fetchCollaborators from "../../controller/collaborators/fetchCollaborators.controller.js";

const router = express.Router();

router.post("/hierarchy", saveBrandArchitecture);
router.get("/:brandName", fetchBrandHierarchy);
router.post("/sector", addSector);
router.get("/collaborators/:brandName", fetchCollaborators);

export default router;
