// routes/taskRoutes.js
import express from "express";
import { taskCreation } from "../../controller/Project/taskCreation.controller.js";

const router = express.Router();

// Route to handle task creation
router.post("/task", taskCreation);

export default router;
