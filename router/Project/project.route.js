import express from "express";
import { 
    createProject, 
    getAllProject, 
    getProject, 
    addContent, 
    removeContent, 
    deleteProject 
} from "../../controller/Project/project.controller.js";

const router = express.Router();

// Route to handle project creation
router.post("/create", createProject);

// Route to get all projects
router.get("/all", getAllProject);

// Route to get a specific project
router.get("/:projectId", getProject);

// Route to add content to a project
router.post("/:projectId/content", addContent);

// Route to remove content from a project
router.delete("/:projectId/content/:contentId", removeContent);

// Route to delete a project
router.delete("/:projectId", deleteProject);

export default router;
