import express from "express";
import { forgotPassword } from "../../controller/authentication/passwordReset.controller.js";

const router = express.Router();

router.post('/', forgotPassword);

export default router;
