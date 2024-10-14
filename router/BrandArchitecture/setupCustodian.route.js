import express from "express";
import { setupCustodian } from "../../controller/BrandArchitecture/setupCustodian.Controller.js";

const router = express.Router();

// lite or pro can be passed in the route parameter based on the accountType
router.post("/:accountType", setupCustodian);

export default router;
