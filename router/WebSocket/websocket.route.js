import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Creator from "../../model/User/creator.model.js";
import Task from "../../model/Project/task.model.js";
import { contentEditController } from "../../controller/fastAPI/makeIdeaEdit.controller.js";
import { brainstormController } from "../../controller/fastAPI/brainstorming.controller.js";

dotenv.config();
const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:7000';

const websocketRoutes = (io) => {

    // Namespace for handling content edits from editor
    const contentEditNamespace = io.of('/api/projects/task/:taskId/editor/:editorId/edit');

    contentEditNamespace.on('connection', async (socket) => {
        console.log('Client connected to contentEdit namespace:', socket.id);

        const namespaceParts = socket.nsp.name.split('/');
        const taskId = namespaceParts[3];  // Extract taskId
        const editorId = namespaceParts[5];  // Extract editorId

        // Check if request data is valid
        if (!taskId || !editorId) {
            // Send an error event to the client and disconnect
            socket.emit('error', { message: "Incomplete request data." });
            socket.disconnect(true);
            return;
        }
        if (!mongoose.isValidObjectId(taskId) || !mongoose.isValidObjectId(editorId)) {
            // Send an error event to the client and disconnect
            socket.emit('error', { message: "Invalid request data." });
            socket.disconnect(true);
            return;
        }

        // Fetch task from database
        const taskCheck = await Task.findById(taskId);
        
        // If task not found
        if (!taskCheck) {
            // Send an error event to the client and disconnect
            socket.emit('error', { message: "Task not found." });
            socket.disconnect(true);
            return;
        }

        // If task editor does not match or is not sent for editing
        if (taskCheck.editedBy != editorId || taskCheck.status != "editing_required") {
            // Send an error event to the client and disconnect
            socket.emit('error', { message: "Unauthorised." });
            socket.disconnect(true);
            return;
        }

        // Handle content-related events
        contentEditController(socket, taskId, editorId);

        socket.on('disconnect', async () => {
            console.log('Client disconnected from brainstorm namespace:', socket.id);
            try {
                // Make request to FastAPI to delete user's memory
                await axios.delete(`${FASTAPI_URL}/idea/edit/delete-memory`, {
                    params: { user_id: editorId }
                });
            } catch (error) {
                console.error('Error deleting user memory:', error.message);
            }
        });
    });

    // Namespace for handling brainstorm functionalities
    const brainstormNamespace = io.of('/api/content/brainstorm'); // ?userId=...

    brainstormNamespace.on('connection', async (socket) => {
        console.log('Client connected to brainstorm namespace:', socket.id);
        // Access query parameters from the socket connection to obtain userId
        const queryParams = socket.handshake.query;
        const userId = queryParams.userId;

        // Check if request data is valid
        if (!userId) {
            // Send an error event to the client and disconnect
            socket.emit('error', { message: 'Incomplete request data.' });
            socket.disconnect(true);
            return;
        }
        if (!mongoose.isValidObjectId(userId)) {
            // Send an error event to the client and disconnect
            socket.emit('error', { message: "Invalid request data." });
            socket.disconnect(true);
            return;
        }

        // Fetch user details from database which is creator
        const userCheck = await Creator.findById(userId);
        
        // If id is not associated with creator, do not allow to access functionality
        if (!userCheck) {
            // Send an error event to the client and disconnect
            socket.emit('error', { message: 'Unauthorised.' });
            socket.disconnect(true);
            return;
        }

        // Handle brainstorm-related events
        brainstormController(socket, userId);

        socket.on('disconnect', async () => {
            console.log('Client disconnected from brainstorm namespace:', socket.id);
            try {
                // Make request to FastAPI to delete user's memory
                await axios.delete(`${FASTAPI_URL}/brainstorm/delete-memory`, {
                    params: { user_id: userId }
                });
            } catch (error) {
                console.error('Error deleting user memory:', error.message);
            }
        });
    });
};

export default websocketRoutes;
