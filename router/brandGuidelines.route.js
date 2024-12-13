import express from "express"
import { createBrandGuidelines, getBrandGuidelines, updateBrandGuidelines } from "../controller/BrandArchitecture/brandGuidelines.controller.js"

const router = express.Router()

router.post('/create', createBrandGuidelines);
router.get('/get', getBrandGuidelines);
router.post('/update', updateBrandGuidelines);


export default router;