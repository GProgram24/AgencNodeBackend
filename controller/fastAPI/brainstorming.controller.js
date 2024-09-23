import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:7000';

// Brainstorm connection handler
export const brainstormController = (socket) => {
  // Idea setup event handler
  socket.on('initialContext', async (message) => {
    console.log(`Initial message received in /brainstorm from ${socket.id}: ${message}`);
    try {
      const response = await axios.post(`${FASTAPI_URL}/brainstorm/init`, { message });
      socket.emit('initialContextResponse', response.data);
    } catch (error) {
      console.error('Error in initialContext:', error);
      socket.emit('error', { message: 'Error processing initial context' });
    }
  });

  // Idea selection event handler
  socket.on('selectIdea', async (ideaData) => {
    console.log(`Idea selection received in /brainstorm from ${socket.id}: ${ideaData}`);
    try {
      const response = await axios.post(`${FASTAPI_URL}/brainstorm/select-idea`, { ideaData });
      socket.emit('selectIdeaResponse', response.data);
    } catch (error) {
      console.error('Error in selectIdea:', error);
      socket.emit('error', { message: 'Error processing idea selection' });
    }
  });

  // Feedback event handler
  socket.on('feedback', async (feedbackData) => {
    console.log(`Feedback received in /brainstorm from ${socket.id}: ${feedbackData}`);
    try {
      const response = await axios.post(`${FASTAPI_URL}/brainstorm/feedback`, { feedbackData });
      socket.emit('feedbackResponse', response.data);
    } catch (error) {
      console.error('Error in feedback:', error);
      socket.emit('error', { message: 'Error processing feedback' });
    }
  });
};