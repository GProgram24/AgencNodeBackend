import express from "express";
import setupEditorViewer from "../../controller/BrandArchitecture/setupEditorViewer.controller.js";

const router = express.Router();

router.post("/", setupEditorViewer);

export default router;