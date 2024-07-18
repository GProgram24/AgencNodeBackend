import express from "express";
import { accountAvailability, brandAvailability, emailAvailability } from "../controller/authentication/availability.controller.js";

const router = express.Router();

router.post("/email", emailAvailability);
router.post("/account", accountAvailability);
router.post("/brand", brandAvailability);
router.post("/:others", ((req, res) => {
    res.status(422).json({ message: "Invalid request" });
}
));

export default router;