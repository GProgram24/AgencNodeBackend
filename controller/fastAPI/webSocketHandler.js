import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

export const setupWebSockets = (server) => {
    // WebSocket server for brainstorming
    const frontendBrainstorming = new WebSocketServer({ server, path: '/api/content/brainstorming' });

    frontendBrainstorming.on('connection', (clientSocket) => {
        console.log('Frontend WebSocket client');

        // WebSocket to connect NodeJS to FastAPI
        const fastAPISocket = new WebSocket(`${process.env.FASTAPI_SOCKET}/content/brainstorming`);

        fastAPISocket.on('open', () => {
            console.log('Connected to FastAPI WebSocket');
        });

        fastAPISocket.on('message', (message) => {
            // Forward message from FastAPI to frontend client
            console.log(`Received message from fastapi: ${message}`);
            clientSocket.send(message.toString());
        });

        fastAPISocket.on('close', () => {
            console.log('Disconnected from FastAPI WebSocket server');
        });

        fastAPISocket.on('error', (error) => {
            console.error('WebSocket error with FastAPI:', error);
            clientSocket.close();
        });

        clientSocket.on('message', (message) => {
            console.log(`Received message from frontend: ${message}`);
            try {
                // Parse message from frontend as JSON
                const parsedMessage = JSON.parse(message);

                // Forward JSON message to FastAPI server
                fastAPISocket.send(JSON.stringify(parsedMessage));
            } catch (error) {
                console.error('Error parsing message from frontend:', error);
            }
        });

        clientSocket.on('close', () => {
            console.log('Frontend WebSocket client disconnected');
            fastAPISocket.close();
        });

        clientSocket.on('error', (error) => {
            console.error('WebSocket error with frontend client:', error);
        });
    });

    // WebSocket server for brainstorming
    const frontendIdea = new WebSocketServer({ server, path: '/api/content/idea' });

    frontendIdea.on('connection', (clientSocket) => {
        console.log('Frontend WebSocket client');

        // WebSocket to connect NodeJS to FastAPI
        const fastAPISocket = new WebSocket(`${process.env.FASTAPI_SOCKET}/content/idea`);

        fastAPISocket.on('open', () => {
            console.log('Connected to FastAPI WebSocket');
        });

        fastAPISocket.on('message', (message) => {
            // Forward message from FastAPI to frontend client
            console.log(`Received message from fastapi: ${message}`);
            clientSocket.send(message.toString());
        });

        fastAPISocket.on('close', () => {
            console.log('Disconnected from FastAPI WebSocket server');
        });

        fastAPISocket.on('error', (error) => {
            console.error('WebSocket error with FastAPI:', error);
        });

        clientSocket.on('message', (message) => {
            console.log(`Received message from frontend: ${message}`);
            try {
                // Parse message from frontend as JSON
                const parsedMessage = JSON.parse(message);

                // Forward JSON message to FastAPI server
                fastAPISocket.send(JSON.stringify(parsedMessage));
            } catch (error) {
                console.error('Error parsing message from frontend:', error);
            }
        });

        clientSocket.on('close', () => {
            console.log('Frontend WebSocket client disconnected');
            fastAPISocket.close();
        });

        clientSocket.on('error', (error) => {
            console.error('WebSocket error with frontend client:', error);
        });
    });
};
