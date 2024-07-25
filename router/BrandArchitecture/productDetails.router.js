import express from "express";
import { addProductServiceMeta, addTargetAudience, getProductDetails } from "../../controller/BrandArchitecture/productDetails.controller.js";

const router = express.Router();

router.post("/description", addProductServiceMeta);
router.post("/target-audience", addTargetAudience);
router.get("/:brandName", getProductDetails);

export default router;
