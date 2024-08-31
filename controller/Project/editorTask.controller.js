import mongoose from "mongoose";
import Task from "../../model/Project/task.model.js";
import Editor from "../../model/User/editor.model.js";
import Project from "../../model/Project/project.model.js";

// Fetch unaccepted tasks for editor
export const fetchUnacceptedTasksForEditor = async (req, res) => {
  try {
    const { editorId } = req.params;

    // Validate the editorId
    if (!mongoose.isValidObjectId(editorId)) {
      return res.status(422).json({ message: "Invalid editor ID." });
    }

    // Fetch the parentId (creatorId) from the Editor model
    const editor = await Editor.findOne({ _id: editorId }).select("parentId");
    if (!editor) {
      return res.status(404).json({ message: "Editor not found." });
    }

    const creatorId = editor.parentId;

    // Find project name created by the parent
    const projects = await Project.find({ creator: creatorId }).select("name")
      .populate({
        path: 'tasks',
        match: {
          status: "editing_required", // Match status to fetch only required tasks
          editedBy: null // Not accepted by any editor
        },
        select: '_id status touchpoint goal createdAt'
      });

    // Create response object
    const taskDetails = projects.reduce((acc, project) => {
      project.tasks.forEach(task => {
        acc.push({
          name: project.name,
          taskId: task._id,
          status: task.status,
          touchpoint: task.touchpoint,
          goal: task.goal,
          createdAt: task.createdAt,
        });
      });
      return acc;
    }, []);

    return res.status(200).json({ taskDetails });
  } catch (error) {
    console.log("Error in fetching unaccepted tasks for editor:", error);
    res.status(500).json({ message: "Failed to fetch unaccepted tasks for editor." });
  }
};

// Fetch accepted tasks for editor
export const fetchAcceptedTasksForEditor = async (req, res) => {
  try {
    const { editorId } = req.params;

    // Validate the editorId
    if (!mongoose.isValidObjectId(editorId)) {
      return res.status(422).json({ message: "Invalid editor ID." });
    }

    // Fetch the parentId (creatorId) from the Editor model
    const editor = await Editor.findOne({ _id: editorId }).select("parentId");
    if (!editor) {
      return res.status(404).json({ message: "Editor not found." });
    }

    const creatorId = editor.parentId;

    // Find project name created by the parent
    const projects = await Project.find({ creator: creatorId }).select("name")
      .populate({
        path: 'tasks',
        match: {
          status: "editing_required", // Match status to fetch only required tasks
          editedBy: editorId // Accepted by the editor
        },
        select: '_id status touchpoint goal createdAt'
      });

    // Create response object
    const taskDetails = projects.reduce((acc, project) => {
      project.tasks.forEach(task => {
        acc.push({
          name: project.name,
          taskId: task._id,
          status: task.status,
          touchpoint: task.touchpoint,
          goal: task.goal,
          createdAt: task.createdAt,
        });
      });
      return acc;
    }, []);

    return res.status(200).json({ taskDetails });
  } catch (error) {
    console.log("Error in fetching accepted tasks for editor:", error);
    res.status(500).json({ message: "Failed to fetch accepted tasks by editor." });
  }
};

// Accept task for editor
export const acceptTaskByEditor = async (req, res) => {
  try {
    const { taskId, editorId } = req.params;

    // Validate taskId and editorId
    if (!mongoose.isValidObjectId(taskId) || !mongoose.isValidObjectId(editorId)) {
      return res.status(422).json({ message: "Invalid task or editor ID." });
    }

    // Fetch the parentId (creatorId) from the Editor model
    const editor = await Editor.findOne({ _id: editorId }).select("parentId");
    if (!editor) {
      return res.status(404).json({ message: "Editor not found." });
    }

    const creatorId = editor.parentId;

    // Find and update the task if it matches the creatorId and is not already accepted by another editor
    const task = await Task.findOneAndUpdate(
      { _id: taskId, editedBy: null, status: "editing_required", creator: creatorId },
      { editedBy: editorId },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found, already accepted by another editor, or not send for editing." });
    }

    return res.status(200).json({ message: "Task accepted successfully by editor.", task });
  } catch (error) {
    console.log("Error in accepting task by editor:", error);
    res.status(500).json({ message: "Failed to accept task by editor." });
  }
};

// Approve content by editor
export const approveTaskByEditor = async (req, res) => {
  try {
    const { taskId, editorId } = req.params;
    const { comment, updatedContent } = req.body;

    // Validate taskId and editorId
    if (!mongoose.isValidObjectId(taskId) || !mongoose.isValidObjectId(editorId)) {
      return res.status(422).json({ message: "Invalid task or editor ID." });
    }

    // Fetch the parentId (creatorId) from the Editor model
    const editor = await Editor.findOne({ _id: editorId }).select("parentId");
    if (!editor) {
      return res.status(404).json({ message: "Editor not found." });
    }

    const creatorId = editor.parentId;

    // Find the task by ID and ensure it matches the creatorId
    const task = await Task.findOne({ _id: taskId, creator: creatorId });
    if (!task) {
      return res.status(404).json({ message: "Task not found or does not match creator." });
    }

    // Check if the editor is authorized to approve this task
    if (task.editedBy && task.editedBy.toString() !== editorId) {
      return res.status(403).json({ message: "You are not authorized to approve this task." });
    }

    // Update task status to 'approved' and set finalContent to the updated content
    task.status = "approved";
    task.finalContent = updatedContent || task.content; // Use updated content if provided, else use existing content

    // Optionally add an editor comment
    if (comment) {
      task.editorComment = comment;
      task.editorCommentDate = new Date();
    }

    // Save the updated task
    await task.save();

    res.status(200).json({ message: "Task approved successfully by editor.", task });
  } catch (error) {
    console.log("Error in approving task by editor:", error);
    res.status(500).json({ message: "Failed to approve task by editor." });
  }
};
