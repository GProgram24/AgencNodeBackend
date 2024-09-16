import { brainstormHandlers, contentEditHandler } from "../../controller/websocket/websocket.controller.js";

const websocketRoutes = (io) => {

    // Namespace for handling content edits from editor
    const contentEditNamespace = io.of('/api/projects/task/:taskId/editor/:editorId/edit');

    contentEditNamespace.on('connection', (socket) => {
        console.log('Client connected to contentEdit namespace:', socket.id);

        // Handle editorMakeanIdea-related events
        contentEditHandler(socket);

        socket.on('disconnect', () => {
            console.log('Client disconnected from contentEdit namespace:', socket.id);
        });
    });

    // Namespace for handling brainstorm functionalities
    const brainstormNamespace = io.of('/api/brainstorm/chat'); // to make route to /api/content/brainstorm, remove this from fastAPIhandler

    brainstormNamespace.on('connection', (socket) => {
        console.log('Client connected to brainstorm namespace:', socket.id);

        // Handle brainstorm-related events
        brainstormHandlers(socket);

        socket.on('disconnect', () => {
            console.log('Client disconnected from brainstorm namespace:', socket.id);
        });
    });
};

export default websocketRoutes;
