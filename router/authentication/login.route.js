import express from "express";
import { loginUser } from "../../controller/authentication/login.controller.js"

const router = express.Router();

router.post('/', loginUser);

export default router;
