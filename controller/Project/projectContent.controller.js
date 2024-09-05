import mongoose from "mongoose";
import Project from "../../model/Project/project.model.js";
import Task from "../../model/Project/task.model.js";
import Viewer from "../../model/User/viewer.model.js";
import Editor from "../../model/User/editor.model.js";

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

// Controller to fetch a specific content
export const getContent = async (req, res) => {
  try {
    const { userRoleId, taskId } = req.params;

    // Validate userRoleId and taskId
    if (!mongoose.isValidObjectId(userRoleId) || !mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid user role ID or task ID." });
    }

    // Find the task by ID and check if userRoleId is involved
    const task = await Task.findOne({
      _id: taskId,
      $or: [
        { creator: userRoleId },
        { vettedBy: userRoleId },
        { editedBy: userRoleId }
      ]
    })
      .populate([
        { path: "creator", select: "name" },
        { path: "vettedBy", select: "name" },
        { path: "editedBy", select: "name" },
        { path: "product", select: "name" },
        { path: "targetAudience", select: "-productServiceId -createdAt -updatedAt" }
      ]);

    if (!task) {

      // Fetch parent of the user i.e. creator and check if it is same as the creator of task
      // User can be either viewer or editor
      // Below, after fetching the task, if task is found, we have the creator id, we need to check if it is parent of viewer or editor for given id
      // To be added later, or immediately if requirement is raised

      // Perform additional checks to determine the specific reason for failure
      const taskExists = await Task.findById(taskId);
      if (!taskExists) {
        return res.status(404).json({ message: "Task not found." });
      }

      const isUserAuthorized = (
        taskExists.creator.toString() === userRoleId ||
        taskExists.vettedBy?.toString() === userRoleId ||
        taskExists.editedBy?.toString() === userRoleId
      );

      if (!isUserAuthorized) {
        return res.status(403).json({ message: "You are not authorized to view this task." });
      }

      // If none of the above, return a generic error (should not usually reach here)
      return res.status(500).json({ message: "Failed to retrieve task due to unknown error." });
    }

    // If successful, return the task
    return res.status(200).json({ task });
  } catch (error) {
    console.log("Error in getting content:", error);
    res.status(500).json({ message: "Failed to retrieve task content." });
  }
};

// Controller for dashboard analytics data
export const dashboardAnalytics = async (req, res) => {
  const taskRoles = {
    editor: "editedBy",
    viewer: "vettedBy",
    creator: "creator"
  }
  const userRoleCollection = {
    viewer: Viewer,
    editor: Editor
  }
  try {
    const { userType, userRoleId } = req.params;
    const taskRole = taskRoles[userType];

    // Validate input
    if (!userType || !mongoose.isValidObjectId(userRoleId)) {
      return res.status(422).json({ message: "Invalid user role id or missing query parameters." });
    }

    // Check if usertype is valid
    if (!taskRole) {
      return res.status(400).json({ message: "Invalid userType." });
    }

    if (taskRole !== "creator") {
      const userCollection = userRoleCollection[userType];

      // Fetch the parentId (creatorId) from the usertype model
      const user = await userCollection.findOne({ _id: userRoleId }).select("parentId");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const creatorId = user.parentId;

      // Aggregate query 
      if (taskRole == "vettedBy") {
        const taskCounts = await Task.aggregate([
          {
            $match: {
              creator: new mongoose.Types.ObjectId(creatorId), // Match tasks for the creator's parentId
            },
          },
          {
            $facet: {
              // Separate tasks into different status sets
              pendingApproval: [
                {
                  $match: {
                    status: "pending_approval", // Only consider tasks with pending_approval status
                  },
                },
                {
                  $group: {
                    _id: {
                      accepted: { $ne: ["$vettedBy", null] }, // Check if vettedBy is not null (accepted) or null (unaccepted)
                    },
                    count: { $sum: 1 }, // Count the tasks in each group
                  },
                },
                {
                  $project: {
                    accepted: "$_id.accepted", // Show whether the task was accepted
                    count: 1,
                    _id: 0, // Remove _id
                  },
                },
              ],
              otherStatuses: [
                {
                  $match: {
                    status: { $ne: "pending_approval" }, // Match tasks with statuses other than pending_approval
                    vettedBy: new mongoose.Types.ObjectId(userRoleId), // Only tasks accepted by this viewer
                  },
                },
                {
                  $group: {
                    _id: "$status", // Group by status
                    count: { $sum: 1 }, // Count the tasks
                  },
                },
                {
                  $project: {
                    status: "$_id", // Rename _id to status
                    count: 1,
                    _id: 0, // Remove _id
                  },
                },
              ],
            },
          },
          {
            $project: {
              pendingApproval: 1,
              otherStatuses: 1,
            },
          },
        ]);

        return res.status(200).json({ taskCounts });

      } else {
        const taskCounts = await Task.aggregate([
          {
            $match: {
              creator: new mongoose.Types.ObjectId(creatorId), // Match tasks for the creator's parentId
              vettedBy: { $ne: null }, // Ensure the task has been accepted by a viewer
            },
          },
          {
            $facet: {
              editingRequired: [
                {
                  $match: {
                    status: "editing_required", // Only consider tasks with "editing_required" status
                  },
                },
                {
                  $group: {
                    _id: {
                      accepted: { $ne: ["$editedBy", null] }, // Check if editedBy is not null (accepted) or null (unaccepted)
                      isAcceptedByEditor: { $eq: ["$editedBy", new mongoose.Types.ObjectId(userRoleId)] }, // Check if editedBy matches editor ID
                    },
                    count: { $sum: 1 }, // Count the tasks in each group
                  },
                },
                {
                  $project: {
                    accepted: "$_id.accepted", // Show whether the task was accepted by any editor
                    isAcceptedByEditor: "$_id.isAcceptedByEditor", // Show if the task was accepted by the specific editor
                    count: 1,
                    _id: 0, // Remove _id
                  },
                },
              ],
              otherStatuses: [
                {
                  $match: {
                    status: { $in: ["approved", "published"] }, // Match tasks with statuses approved or published
                    editedBy: new mongoose.Types.ObjectId(userRoleId), // Only tasks accepted by this editor
                  },
                },
                {
                  $group: {
                    _id: "$status", // Group by status
                    count: { $sum: 1 }, // Count the tasks
                  },
                },
                {
                  $project: {
                    status: "$_id", // Rename _id to status
                    count: 1,
                    _id: 0, // Remove _id
                  },
                },
              ],
            },
          },
          {
            $project: {
              editingRequired: 1,
              otherStatuses: 1,
            },
          },
        ]);

        return res.status(200).json({ taskCounts });

      }

    } else {
      // Aggregate query to count tasks by status for the creator
      const taskCounts = await Task.aggregate([
        {
          $match: {
            creator: new mongoose.Types.ObjectId(userRoleId), // Match tasks for the creator
          },
        },
        {
          $group: {
            _id: "$status", // Group by task status
            count: { $sum: 1 }, // Count the number of tasks for each status
          },
        },
        {
          $project: {
            status: "$_id", // Rename _id to status
            count: 1,
            _id: 0, // Remove _id field
          },
        },
      ]);

      // Send response with task counts grouped by status
      return res.status(200).json({ taskCounts });
    }


  } catch (error) {
    console.log("Error in dashboard anaytics data controller:", error);
    return res.status(500).json({ message: "Server error" });

  }
};

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