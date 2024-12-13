import express from "express";
import { 
    createProject, 
    getAllProjects, 
    getProject,
    deleteProject 
} from "../../controller/Project/project.controller.js";

const router = express.Router();

// Route to handle project creation
router.post("/", createProject);

// Route to get all projects
router.get("/", getAllProjects);

// Route to get a specific project
router.get("/:projectId", getProject);

// Route to delete a specific project
router.delete("/:projectId", deleteProject);

export default router;
