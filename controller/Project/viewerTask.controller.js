import mongoose from "mongoose";
import Task from "../../model/Project/task.model.js";
import Viewer from "../../model/User/viewer.model.js";

// Fetch tasks for viewer 
export const fetchTasksForViewer = async (req, res) => {
    try {
      const { viewerId } = req.params;
  
      // Validate the viewerId
      if (!mongoose.isValidObjectId(viewerId)) {
        return res.status(422).json({ message: "Invalid viewer ID." });
      }
  
      // Fetch the parentId (creatorId) from the Viewer model
      const viewer = await Viewer.findOne({ _id: viewerId }).select("parentId");
      if (!viewer) {
        return res.status(404).json({ message: "Viewer not found." });
      }
  
      const creatorId = viewer.parentId;
  
      // Find tasks assigned to the viewer or unassigned tasks (vettedBy is null)
      // and only those created by the same creator (parentId of the viewer)
      const tasks = await Task.find({
        creator: creatorId,  // Match the creatorId with the parentId from the Viewer model
        $or: [
          { vettedBy: null },
          { vettedBy: viewerId }
        ]
      });
  
      return res.status(200).json({ tasks });
    } catch (error) {
      console.log("Error in fetching tasks for viewer:", error);
      return res.status(500).json({ message: "Failed to fetch tasks for viewer." });
    }
  };
  
  // Accept task for viewer
  export const acceptTaskByViewer = async (req, res) => {
    try {
      const { taskId, viewerId } = req.params;
  
      // Validate IDs
      if (!mongoose.isValidObjectId(taskId) || !mongoose.isValidObjectId(viewerId)) {
        return res.status(422).json({ message: "Invalid task or viewer ID." });
      }
  
      // Fetch the parentId (creatorId) from the viewer model
      const viewer = await Viewer.findOne({ _id: viewerId }).select("parentId");
      if (!viewer) {
        return res.status(404).json({ message: "Viewer not found." });
      }
  
      const creatorId = viewer.parentId;
  
      // Find and update the task
      const task = await Task.findOneAndUpdate(
        { _id: taskId, vettedBy: null, creator: creatorId }, // Only allow update if vettedBy is null and is of same creator
        { vettedBy: viewerId },
        { new: true }
      );
  
      if (!task) {
        return res.status(404).json({ message: "Task not found or already accepted by another viewer." });
      }
  
      return res.status(200).json({ message: "Task accepted successfully.", task });
    } catch (error) {
      console.log("Error in accepting task:", error);
      return res.status(500).json({ message: "Failed to accept task." });
    }
  };
  
  // Approve content by viewer
  export const approveTaskByViewer = async (req, res) => {
    try {
      const { taskId, viewerId } = req.params;
      const { comment } = req.body;
  
      // Validate taskId and viewerId
      if (!mongoose.isValidObjectId(taskId) || !mongoose.isValidObjectId(viewerId)) {
        return res.status(422).json({ message: "Invalid task or viewer ID." });
      }
  
      // Find the task by ID
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }
  
      // Check if the viewer requesting approval is the same as the one who accepted the task
      if (task.vettedBy && task.vettedBy.toString() !== viewerId) {
        return res.status(403).json({ message: "You are not authorized to approve this task." });
      }
  
      // Update task status to 'approved' and set finalContent to the current content
      task.status = "approved";
      task.finalContent = task.content;
  
      // Optionally add a viewer comment
      if (comment) {
        task.viewerComment = comment;
        task.viewerCommentDate = new Date();
      }
  
      // Save the updated task
      await task.save();
  
      return res.status(200).json({ message: "Task approved successfully by viewer.", task });
    } catch (error) {
      console.log("Error in approving task by viewer:", error);
      return res.status(500).json({ message: "Failed to approve task by viewer." });
    }
  };
  
  // Send content for editing
  export const sendForEditing = async (req, res) => {
    try {
      const { taskId, viewerId } = req.params;
      const { comment } = req.body;
  
      // Validate taskId and viewerId
      if (!mongoose.isValidObjectId(taskId) || !mongoose.isValidObjectId(viewerId)) {
        return res.status(422).json({ message: "Invalid task or viewer ID." });
      }
  
      // Find the task by ID
      const task = await Task.findById(taskId);
  
      if (!task) {
        return res.status(404).json({ message: "Task not found." });
      }
  
      // Check if the viewer requesting to send for editing is the same as the one who accepted the task
      if (task.vettedBy && task.vettedBy.toString() !== viewerId) {
        return res.status(403).json({ message: "You are not authorized to send this task for editing." });
      }
  
      // Update task status to 'editing_required' and add the viewer's comment
      task.status = "editing_required";
      task.viewerComment = comment;
      task.viewerCommentDate = new Date();
  
      // Save the updated task
      await task.save();
  
      res.status(200).json({ message: "Task sent for editing.", task });
    } catch (error) {
      console.log("Error in sending task for editing:", error);
      res.status(500).json({ message: "Failed to send task for editing." });
    }
  };
  