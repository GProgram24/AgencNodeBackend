import mongoose, { Mongoose } from "mongoose";
import Project from "../../model/Project/project.model.js";

export const createProject = async (req, res) => {
    try {
        const { name, startDate, endDate, tasks = [], creatorId } = req.body;
        // Check if request data is valid
        if (!name || !startDate || !endDate) {
            return res.status(422).json({ message: "Missing required data" });
        }
        if (!mongoose.isValidObjectId(creatorId)) {
            return res.status(422).json({ message: "invalid creator id" });
        }

        // Create a new project instance
        const newProject = new Project({
            name,
            startDate,
            endDate,
            tasks,
            creatorId,
        });

        // Save the project to the database
        const savedProject = await newProject.save();

        // Return the newly created project
        res.status(201).json(savedProject);
    } catch (error) {
        console.log("Error in creating project:", error)
        res.status(500).json({ message: "Failed to create project" });
    }
}

export const getAllProject = async (req, res) => {
    try {
        const { creatorId } = req.body;

        // Check if creatorId is provided
        if (!mongoose.isValidObjectId(creatorId)) {
            return res.status(400).json({ message: "Creator ID is invalid." });
        }

        // Find all projects under the creator
        const projects = await Project.find({ creator: creatorId }).select("name startDate endDate")

        // Check if projects exist for the creator
        if (projects.length === 0) {
            return res.status(404).json({ message: "No projects found." });
        } else {
            // Return the list of projects
            res.status(200).json(projects);
        }
    } catch (error) {
        console.log("Error in fetching projects:", error);
        res.status(500).json({ message: "Failed to retrieve projects" });
    }
}

export const getProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        // Check if the id received is valid
        if (!mongoose.isValidObjectId(projectId)) {
            return res.status(422).json({ message: "invalid project id" })
        }

        // Find the project by ID and populate the tasks array with necessary task details
        const project = await Project.findById(projectId)
            .populate({
                path: "tasks",
                select: "idea product targetAudience status",  // Only fetch these fields from Task
                populate: [
                    { path: "product", select: "name" }, // Select name from ProductService
                    { path: "targetAudience", select: "audienceName" } // Select audience name from TargetAudience
                ]
            })
            .populate({
                path: "creator",
                select: "name", // Include creator name
            });

        // Check if the project exists
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Return the project with its tasks
        res.status(200).json(project);
    } catch (error) {
        console.log("Error in fetching single project:", error);
        res.status(500).json({ message: "Failed to retrieve project" });
    }
}

export const addContent = async (req, res) => {
    res.status(200).json({ message: "add content controller" })
}

export const removeContent = async (req, res) => {
    res.status(200).json({ message: "remove content controller" })
}

export const deleteProject = async (req, res) => {
    res.status(200).json({ message: "delete project controller" })
}