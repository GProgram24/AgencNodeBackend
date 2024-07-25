import express from "express";
import { addProductServiceMeta, addTargetAudience, addSector, getProductDetails } from "../../controller/BrandArchitecture/productDetails.controller.js";

const router = express.Router();

router.post("/sector", addSector);
router.post("/description", addProductServiceMeta);
router.post("/target-audience", addTargetAudience);
router.get("/:brandName", getProductDetails);

export default router;
