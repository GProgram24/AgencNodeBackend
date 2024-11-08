import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Creator from "../../model/User/creator.model.js";
import Viewer from "../../model/User/viewer.model.js";
import Editor from "../../model/User/editor.model.js";
import Task from "../../model/Project/task.model.js";
import { contentEditController } from "../../controller/fastAPI/makeIdeaEdit.controller.js";
import { brainstormController } from "../../controller/fastAPI/brainstorming.controller.js";
import { sampleTestingController } from "../../controller/fastAPI/sampleTesting.controller.js";

dotenv.config();
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:7000";

// Mapping user types to their respective models
const userTypeModels = {
  viewer: Viewer,
  editor: Editor,
  creator: Creator,
};

const websocketRoutes = (io) => {
  // Namespace for handling content edits from editor
  const contentEditNamespace = io.of("/api/projects/task/content/edit");

  contentEditNamespace.on("connection", async (socket) => {
    console.log("Client connected to contentEdit namespace:", socket.id);

    // Extract task and editor id from query params for authorizarion and functionality
    const queryParams = socket.handshake.query;
    const taskId = queryParams.taskId;
    const editorId = queryParams.editorId;

    // Check if request data is valid
    if (!taskId || !editorId) {
      console.log("ids not found");
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Incomplete request data." });
      socket.disconnect(true);
      return;
    }
    if (
      !mongoose.isValidObjectId(taskId) ||
      !mongoose.isValidObjectId(editorId)
    ) {
      console.log("invalid ids");
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Invalid request data." });
      socket.disconnect(true);
      return;
    }

    // Fetch task from database
    const taskCheck = await Task.findById(taskId);

    // If task not found
    if (!taskCheck) {
      console.log("task not found");
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Task not found." });
      socket.disconnect(true);
      return;
    }

    // If task editor does not match or is not sent for editing
    if (
      taskCheck.editedBy != editorId ||
      taskCheck.status != "editing_required"
    ) {
      console.log("task not authorized");
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Unauthorised." });
      socket.disconnect(true);
      return;
    }

    // Handle content-related events
    contentEditController(socket, taskId, editorId);

    socket.on("disconnect", async () => {
      console.log("Client disconnected from brainstorm namespace:", socket.id);
      try {
        // Make request to FastAPI to delete user's memory
        await axios.delete(`${FASTAPI_URL}/idea/edit/delete-memory`, {
          params: { user_id: editorId },
        });
      } catch (error) {
        console.error("Error deleting user memory:", error.message);
      }
    });
  });

  // Namespace for handling brainstorm functionalities
  const brainstormNamespace = io.of("/api/content/brainstorm"); // ?userId=...

  brainstormNamespace.on("connection", async (socket) => {
    console.log("Client connected to brainstorm namespace:", socket.id);
    // Access query parameters from the socket connection to obtain userId
    const queryParams = socket.handshake.query;
    const userId = queryParams.userId;

    // Check if request data is valid
    if (!userId) {
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Incomplete request data." });
      socket.disconnect(true);
      return;
    }
    if (!mongoose.isValidObjectId(userId)) {
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Invalid request data." });
      socket.disconnect(true);
      return;
    }

    // Fetch user details from database which is creator
    const userCheck = await Creator.findById(userId);

    // If id is not associated with creator, do not allow to access functionality
    if (!userCheck) {
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Unauthorised." });
      socket.disconnect(true);
      return;
    }

    // Handle brainstorm-related events
    brainstormController(socket, userId);

    socket.on("disconnect", async () => {
      console.log("Client disconnected from brainstorm namespace:", socket.id);
      try {
        // Make request to FastAPI to delete user's memory
        await axios.delete(`${FASTAPI_URL}/brainstorm/delete-memory`, {
          params: { user_id: userId },
        });
      } catch (error) {
        console.error("Error deleting user memory:", error.message);
      }
    });
  });

  // Namespace for sample testing functionality
  const sampleTestingNamespace = io.of("/content/sample");

  sampleTestingNamespace.on("connection", async (socket) => {
    console.log("Client connected to sample testing namespace:", socket.id);

    console.log("Query Params:", socket.handshake.query);

    // Access query parameters from the socket connection to obtain userId
    const queryParams = socket.handshake.query;
    const userId = queryParams.userId;
    const userType = queryParams.type;

    // Check if request data is valid
    if (!userId || !userType) {
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Incomplete request data." });
      socket.disconnect(true);
      return;
    }
    if (!mongoose.isValidObjectId(userId)) {
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Invalid request data." });
      socket.disconnect(true);
      return;
    }

    // Select user model bases on request received
    const UserTypeModel = userTypeModels[userType.toLowerCase()];
    if (!UserTypeModel) {
      socket.emit("error", { message: "Invalid type." });
      socket.disconnect(true);
      return;
    }
    // Fetch user details from database using role and userid
    const userCheck = await UserTypeModel.findById(userId);
    // If user is not found, do not allow to access functionality
    if (!userCheck) {
      // Send an error event to the client and disconnect
      socket.emit("error", { message: "Unauthorised." });
      socket.disconnect(true);
      return;
    }

    // Handle brainstorm-related events
    sampleTestingController(socket, userId);

    socket.on("disconnect", async () => {
      console.log(
        "Client disconnected from sample testing namespace:",
        socket.id
      );
      try {
        // Make request to FastAPI to delete user's memory
        await axios.delete(`${FASTAPI_URL}/brainstorm/delete-memory`, {
          params: { user_id: userId },
        });
      } catch (error) {
        console.error("Error deleting user memory:", error.message);
      }
    });
  });
};

export default websocketRoutes;
