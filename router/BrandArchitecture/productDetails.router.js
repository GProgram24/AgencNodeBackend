import express from "express";
import {
  addProductServiceMeta,
  addTargetAudience,
  getProductDetails,
} from "../../controller/BrandArchitecture/productDetails.controller.js";
import { uploadFile } from "../../controller/product/handleFileData.controller.js";

const router = express.Router();

router.post("/description", addProductServiceMeta);
router.post("/audience", addTargetAudience);
router.get("/:brandName", getProductDetails);
router.post("/upload", uploadFile);

export default router;
