import express from "express";
import {
    taskCreationAndAddToProject,
    removeContent,
} from "../../controller/Project/projectContent.controller.js";
import {
    fetchUnacceptedTasksForEditor,
    fetchAcceptedTasksForEditor,
    acceptTaskByEditor,
    approveTaskByEditor,
} from "../../controller/Project/editorTask.controller.js";
import {
    fetchUnacceptedTasksForViewer,
    fetchAcceptedTasksForViewer,
    acceptTaskByViewer,
    approveTaskByViewer,
    sendForEditing,
} from "../../controller/Project/viewerTask.controller.js";

const router = express.Router();

// Routes for task creation and content management in a project
router.post("/:projectId/task", taskCreationAndAddToProject);
router.delete("/:projectId/tasks/:taskId", removeContent);

// Routes for editor functionalities
router.get("/tasks/editing-required/:editorId", fetchUnacceptedTasksForEditor);
router.get("/tasks/editor/:editorId", fetchAcceptedTasksForEditor);
router.post("/tasks/:taskId/accept/editor/:editorId", acceptTaskByEditor);
router.post("/tasks/:taskId/approve/editor/:editorId", approveTaskByEditor);

// Routes for viewer functionalities
router.get("/tasks/approval-pending/:viewerId", fetchUnacceptedTasksForViewer);
router.get("/tasks/viewer/:viewerId", fetchAcceptedTasksForViewer);
router.post("/tasks/:taskId/accept/viewer/:viewerId", acceptTaskByViewer);
router.post("/tasks/:taskId/approve/viewer/:viewerId", approveTaskByViewer);
router.post("/tasks/:taskId/send-for-editing/:viewerId", sendForEditing);

export default router;
