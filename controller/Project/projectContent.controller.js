import mongoose from "mongoose";
import Project from "../../model/Project/project.model.js";
import Task from "../../model/Project/task.model.js";

// Controller to handle task creation and adding to project
export const taskCreationAndAddToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { creatorId, contentPieces, product, targetAudience, idea, touchpoint, goal, tone } = req.body;

    // Validate input
    if (
      !creatorId ||
      !Array.isArray(contentPieces) ||
      contentPieces.length === 0 ||
      !product ||
      !targetAudience ||
      !idea ||
      !touchpoint ||
      !goal ||
      !tone
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Validate that projectId, creatorId, product, and targetAudience are valid ObjectIds
    if (
      !mongoose.isValidObjectId(projectId) ||
      !mongoose.isValidObjectId(creatorId) ||
      !mongoose.isValidObjectId(product) ||
      !mongoose.isValidObjectId(targetAudience)
    ) {
      return res.status(422).json({ message: "Invalid Id(s) provided" });
    }

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Loop through the content pieces and create a task document for each
    const tasks = contentPieces.map((contentPiece) => ({
      content: contentPiece.text,
      creator: creatorId,
      product,
      targetAudience,
      idea,
      touchpoint,
      goal,
      tone,
      status: "pending_approval",  // Set status during creation
      // Other fields will default to null
    }));

    // Save all tasks to the database
    const createdTasks = await Task.insertMany(tasks);
    const createdTaskIds = createdTasks.map(task => task._id);

    // Add the created tasks to the project's tasks array
    project.tasks.push(...createdTaskIds);

    // Save the updated project
    await project.save();

    return res.status(201).json({ message: "Tasks created and added to project successfully.", project, tasks: createdTasks });
  } catch (error) {
    console.log("Error in creating and adding tasks to project:", error);
    return res.status(500).json({ message: "Error creating and adding tasks to project" });
  }
};

// Controller to remove a content from a project
export const removeContent = async (req, res) => {
  try {
    const { projectId, taskId } = req.params;

    // Validate the projectId
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(422).json({ message: "Invalid project ID." });
    }

    // Validate the taskId
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(422).json({ message: "Invalid task ID." });
    }

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Find the index of the taskId in the tasks array
    const indexToRemove = project.tasks.indexOf(taskId);

    // If the taskId exists in the array, remove it
    if (indexToRemove > -1) {
      project.tasks.splice(indexToRemove, 1);

      // Save the updated project
      await project.save();

      return res.status(200).json({ message: "Task removed successfully.", project });
    }

    // If the taskId was not found in the array
    return res.status(404).json({ message: "Task not found in project." });
  } catch (error) {
    console.log("Error in removing task from project:", error);
    return res.status(500).json({ message: "Failed to remove task from project" });
  }
}

// Publish content
export const publishTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate taskId
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(422).json({ message: "Invalid task ID." });
    }

    // Find the task by ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // Ensure the task is approved before publishing
    if (task.status !== "approved") {
      return res.status(400).json({ message: "Task must be approved before it can be published." });
    }

    // Update task status to 'published'
    task.status = "published";

    // Save the updated task
    await task.save();

    res.status(200).json({ message: "Task published successfully.", task });
  } catch (error) {
    console.log("Error in publishing task:", error);
    res.status(500).json({ message: "Failed to publish task." });
  }
};