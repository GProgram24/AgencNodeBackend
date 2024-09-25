import { contentEditController } from "../../controller/fastAPI/makeIdeaEdit.controller.js";
import { brainstormController } from "../../controller/fastAPI/brainstorming.controller.js";

const websocketRoutes = (io) => {

    // Namespace for handling content edits from editor
    const contentEditNamespace = io.of('/api/projects/task/:taskId/editor/:editorId/edit');

    contentEditNamespace.on('connection', (socket) => {
        console.log('Client connected to contentEdit namespace:', socket.id);

        // Handle editorMakeanIdea-related events
        contentEditController(socket);

        socket.on('disconnect', () => {
            console.log('Client disconnected from contentEdit namespace:', socket.id);
        });
    });

    // Namespace for handling brainstorm functionalities
    const brainstormNamespace = io.of('/api/content/brainstorm'); // ?userId=...

    brainstormNamespace.on('connection', (socket) => {
        console.log('Client connected to brainstorm namespace:', socket.id);
        // Access query parameters from the socket connection
        const queryParams = socket.handshake.query;
        const userId = queryParams.userId;
        console.log(`Basis: ${userId}`);

        // Handle brainstorm-related events
        brainstormController(socket, userId);

        socket.on('disconnect', async () => {
            console.log('Client disconnected from brainstorm namespace:', socket.id);
            try {
                // Make request to FastAPI to clear user's memory
                const response = await axios.delete(`${FASTAPI_URL}/brainstorm/delete-memory`, {
                    user_id: userId
                });
                console.log(response.data.message);
            } catch (error) {
                console.error('Error deleting user memory:', error.message);
            }
        });
    });
};

export default websocketRoutes;
