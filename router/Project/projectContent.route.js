// routes/taskRoutes.js
import express from "express";
import {
    taskCreation,
    addContent,
    removeContent,
} from "../../controller/Project/projectContent.controller.js";

const router = express.Router();

// Route to handle task creation
router.post("/", taskCreation);

// Route to add content to a project
router.post("/content", addContent);

// Route to remove content from a project
router.delete("/:projectId/content/:taskId", removeContent);

export default router;
