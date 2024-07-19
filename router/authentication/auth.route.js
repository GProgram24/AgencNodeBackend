import express from "express";
import { loginUser } from "../../controller/authentication/login.controller.js";
import { forgotPassword } from "../../controller/authentication/passwordReset.controller.js";
import { resetPassword } from "../../controller/authentication/passwordReset.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
