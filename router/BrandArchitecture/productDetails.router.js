import express from "express";
import { addProductServiceMeta, addTargetAudience, getProductDetails } from "../../controller/BrandArchitecture/productDetails.controller.js";
import { divideSampleContentTask } from "../../controller/sampleContent.controller.js";

const router = express.Router();

router.post("/description", addProductServiceMeta);
router.post("/audience", addTargetAudience);
router.get("/:brandName", getProductDetails);
router.post("/vertical", divideSampleContentTask); // To divide tasks, kept here for testing

export default router;
