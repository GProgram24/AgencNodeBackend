import express from "express";
import {
    taskCreationAndAddToProject,
    removeContent,
} from "../../controller/Project/projectContent.controller.js";
import {
    fetchTasksForEditor,
    acceptTaskByEditor,
    approveTaskByEditor,
} from "../../controller/Editor/editorTask.controller.js";
import {
    fetchTasksForViewer,
    acceptTaskByViewer,
    approveTaskByViewer,
    sendForEditing,
} from "../../controller/Viewer/viewerTask.controller.js";

const router = express.Router();

// Routes for task creation and content management in a project
router.post("/:projectId/task", taskCreationAndAddToProject);
router.delete("/:projectId/content/:taskId", removeContent);

// Routes for editor functionalities
router.get("/tasks/editor/:editorId", fetchTasksForEditor);
router.post("/tasks/:taskId/accept/editor/:editorId", acceptTaskByEditor);
router.post("/tasks/:taskId/approve/editor/:editorId", approveTaskByEditor);

// Routes for viewer functionalities
router.get("/tasks/viewer/:viewerId", fetchTasksForViewer);
router.post("/tasks/:taskId/accept/viewer/:viewerId", acceptTaskByViewer);
router.post("/tasks/:taskId/approve/viewer/:viewerId", approveTaskByViewer);
router.post("/tasks/:taskId/send-for-editing/:viewerId", sendForEditing);

export default router;
