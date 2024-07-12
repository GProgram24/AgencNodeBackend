import express from "express";
import { setupCustodian } from "../../controller/BrandArchitecture/setupCustodian.Controller.js";

const router = express.Router();

router.post("/", setupCustodian);

export default router;