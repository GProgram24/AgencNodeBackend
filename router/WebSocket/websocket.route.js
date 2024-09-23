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
    const brainstormNamespace = io.of('/api/content/brainstorm');

    brainstormNamespace.on('connection', (socket) => {
        console.log('Client connected to brainstorm namespace:', socket.id);

        // Handle brainstorm-related events
        brainstormController(socket);

        socket.on('disconnect', () => {
            console.log('Client disconnected from brainstorm namespace:', socket.id);
        });
    });
};

export default websocketRoutes;
