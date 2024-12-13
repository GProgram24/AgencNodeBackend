import mongoose from "mongoose";
import Project from "../../model/Project/project.model.js";
import Task from "../../model/Project/task.model.js";
import Viewer from "../../model/User/viewer.model.js";

// Fetch unacceted tasks for viewer 
export const fetchUnacceptedTasksForViewer = async (req, res) => {
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

    // Find project name created by the parent
    const projects = await Project.find({ creator: creatorId }).select("name")
      .populate({
        path: 'tasks',
        match: {
          status: "pending_approval", // Match status to fetch only required tasks
          vettedBy: null // Not accepted by any viewer
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
    console.log("Error in fetching unaccepted tasks for viewer:", error);
    return res.status(500).json({ message: "Failed to fetch unaccepted tasks for viewer." });
  }
};

// Fetch accepted tasks for viewer
export const fetchAcceptedTasksForViewer = async (req, res) => {
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

    // Find project name created by the parent
    const projects = await Project.find({ creator: creatorId }).select("name")
      .populate({
        path: 'tasks',
        match: {
          status: "pending_approval", // Match status to fetch only required info
          vettedBy: viewerId // Accepted by the viewer
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
    console.log("Error in fetching accepted tasks for viewer:", error);
    return res.status(500).json({ message: "Failed to fetch acceted tasks by viewer." });
  }
}

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
      { _id: taskId, vettedBy: null, status: "pending_approval", creator: creatorId }, // Only allow update if vettedBy is null and is of same creator
      { vettedBy: viewerId },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found, already accepted by another viewer, or not sent to viewer for approval." });
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
    const { comments = [] } = req.body;

    // Validate taskId and viewerId
    if (!mongoose.isValidObjectId(taskId) || !mongoose.isValidObjectId(viewerId)) {
      return res.status(422).json({ message: "Invalid task or viewer ID." });
    }

    // Find the appropriate task
    const task = await Task.findOne({
      _id: taskId,
      status: "pending_approval",
      vettedBy: viewerId,
    });

    if (!task) {
      // Perform an additional query to understand the failure reason
      const taskExists = await Task.findById(taskId);
      if (!taskExists) {
        return res.status(404).json({ message: "Task not found." });
      }
      if (taskExists.status !== "pending_approval") {
        return res.status(400).json({ message: "Task is not sent for approval." });
      }
      if (taskExists.vettedBy.toString() !== viewerId) {
        return res.status(403).json({ message: "You are not authorized to approve this task." });
      }
      if (!taskExists.vettedBy) {
        return res.status(403).json({ message: "Task is not accepted by any viewer." });
      }
      return res.status(500).json({ message: "Failed to update the task." });
    }

    // Update the task with the approval and final content
    task.status = "approved";
    task.finalContent = task.content;
    task.viewerComments.push(
      ...comments.map((comment) => ({
        comment: comment.text,
        date: comment.date || new Date(),
      }))
    );

    const updatedTask = await task.save();

    return res.status(200).json({ message: "Task approved successfully by viewer.", task: updatedTask });
  } catch (error) {
    console.log("Error in approving task by viewer:", error);
    return res.status(500).json({ message: "Failed to approve task by viewer." });
  }
};

// Send content for editing
export const sendForEditing = async (req, res) => {
  try {
    const { taskId, viewerId } = req.params;
    const { comments } = req.body;

    // Check request body for required data
    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ message: "Comments are missing, required." });
    }

    // Validate taskId and viewerId
    if (!mongoose.isValidObjectId(taskId) || !mongoose.isValidObjectId(viewerId)) {
      return res.status(422).json({ message: "Invalid task or viewer ID." });
    }

    // Attempt to find and update the task in a single operation
    const task = await Task.findOneAndUpdate(
      {
        _id: taskId,
        status: "pending_approval",
        vettedBy: viewerId
      },
      {
        $set: {
          status: "editing_required",
        },
        $push: {
          viewerComments: {
            $each: comments.map(comment => ({
              comment: comment.text,
              date: comment.date || new Date(),
            })),
          },
        },
      },
      { new: true }
    );

    if (!task) {
      // Perform additional checks to determine the specific reason for failure
      const taskExists = await Task.findById(taskId);
      if (!taskExists) {
        return res.status(404).json({ message: "Task not found." });
      }
      if (taskExists.status !== "pending_approval") {
        return res.status(400).json({ message: "Task is not sent for approval." });
      }
      if (!taskExists.vettedBy) {
        return res.status(403).json({ message: "Task not accepted by any viewer." });
      }
      if (taskExists.vettedBy.toString() !== viewerId) {
        return res.status(403).json({ message: "You are not authorized to send this task for editing." });
      }
      return res.status(500).json({ message: "Failed to update the task." });
    }

    return res.status(200).json({ message: "Task sent for editing.", task });
  } catch (error) {
    console.log("Error in sending task for editing:", error);
    return res.status(500).json({ message: "Failed to send task for editing." });
  }
};
