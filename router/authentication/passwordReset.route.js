import express from "express";
import { resetPassword } from "../../controller/authentication/passwordReset.controller.js";

const router = express.Router();

router.post('/', resetPassword);

export default router;
