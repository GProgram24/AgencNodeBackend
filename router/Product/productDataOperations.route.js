import express from "express";
import { saveExtractedContent } from "../../controller/product/saveExtractedContent.controller.js";

const router = express.Router();

router.put("/filedata/:id/content", saveExtractedContent);

export default router;
