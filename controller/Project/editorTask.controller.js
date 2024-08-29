import mongoose from "mongoose";
import Task from "../../model/Project/task.model.js";
import Editor from "../../model/User/editor.model.js";

  // Fetch task for editor
  export const fetchTasksForEditor = async (req, res) => {
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
  
      // Find tasks assigned to the editor or unassigned tasks (editedBy is null) that match the creator
      const tasks = await Task.find({
        creator: creatorId, // Match the creatorId with the parentId from the Editor model
        $or: [
          { editedBy: null },
          { editedBy: editorId }
        ]
      });
  
      res.status(200).json({ tasks });
    } catch (error) {
      console.log("Error in fetching tasks for editor:", error);
      res.status(500).json({ message: "Failed to fetch tasks for editor." });
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
        { _id: taskId, editedBy: null, creator: creatorId },
        { editedBy: editorId },
        { new: true }
      );
  
      if (!task) {
        return res.status(404).json({ message: "Task not found, already accepted by another editor, or does not match creator." });
      }
  
      res.status(200).json({ message: "Task accepted successfully by editor.", task });
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
  