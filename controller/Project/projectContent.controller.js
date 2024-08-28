import mongoose from "mongoose";
import Project from "../../model/Project/project.model.js";
import Task from "../../model/Project/task.model.js";

// Controller to handle task creation
export const taskCreation = async (req, res) => {
  try {
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

    // Validate that creatorId, product, and targetAudience are valid ObjectIds
    if (
      !mongoose.isValidObjectId(creatorId) ||
      !mongoose.isValidObjectId(product) ||
      !mongoose.isValidObjectId(targetAudience)
    ) {
      return res.status(422).json({ message: "Invalid Id(s) provided" });
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
      // Other fields will default to null
    }));

    // Save all tasks to the database
    const createdTasks = await Task.insertMany(tasks);

    res.status(201).json({ message: "Tasks created successfully", tasks: createdTasks });
  } catch (error) {
    console.log("Error in saving tasks:", error);
    res.status(500).json({ message: "Error saving tasks" });
  }
};

// Controller to add contents to a project
export const addContent = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { taskIds } = req.body;

    // Validate the projectId
    if (!mongoose.isValidObjectId(projectId)) {
      return res.status(422).json({ message: "Invalid project ID." });
    }

    // Validate the taskIds
    if (!Array.isArray(taskIds) || taskIds.some(id => !mongoose.isValidObjectId(id))) {
      return res.status(422).json({ message: "Invalid task IDs." });
    }

    // Find the project by ID
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Update the status of the new tasks to 'pending_approval'
    await Task.updateMany(
      { _id: { $in: newTaskIds } },
      { $set: { status: "pending_approval" } }
    );

    // Filter out any task IDs that are already in the project's tasks array
    const newTaskIds = taskIds.filter(id => !project.tasks.includes(id));

    // Only update if there are new tasks to add
    if (newTaskIds.length > 0) {
      project.tasks.push(...newTaskIds);

      // Save the updated project
      await project.save();
      return res.status(200).json({ message: "Tasks added successfully.", project });
    }

    // If no new tasks were added, just return a message
    return res.status(200).json({ message: "No new tasks to add.", project });
  } catch (error) {
    console.log("Error in adding task to project:", error);
    res.status(500).json({ message: "Failed to add tasks to project" });
  }
}

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
    res.status(500).json({ message: "Failed to remove task from project" });
  }
}
