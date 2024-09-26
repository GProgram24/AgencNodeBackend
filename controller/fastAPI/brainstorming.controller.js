import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:7000';

// Brainstorm connection handler
export const brainstormController = (socket, userId) => {
  // Idea setup event handler
  socket.on('initialContext', async (message) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/brainstorm/init`, {
        user_id: userId, // User id to manage memory chain on fastapi
        idea_basis: message.ideaBasis,
        campaign_focus: message.campaignFocus,
        basis: message.basis // To select template on fastapi
      });
      socket.emit('initialContextResponse', response.data);
    } catch (error) {
      console.error('Error in initialContext:', error);
      socket.emit('error', { message: 'Error processing initial context' });
    }
  });

  // Idea selection event handler
  socket.on('selectIdea', async (ideaData) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/brainstorm/select-idea`, {
        user_id: userId, // User id to manage memory chain on fastapi
        idea_id: ideaData.selectedIdeaId
      });
      socket.emit('selectIdeaResponse', response.data);
    } catch (error) {
      console.error('Error in selectIdea:', error);
      socket.emit('error', { message: 'Error processing idea selection' });
    }
  });

  // Feedback event handler
  socket.on('feedback', async (feedbackData) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/brainstorm/feedback`, {
        user_id: userId, // User id to manage memory chain on fastapi
        feedback: feedbackData.feedback
      });
      socket.emit('feedbackResponse', response.data);
    } catch (error) {
      console.error('Error in feedback:', error);
      socket.emit('error', { message: 'Error processing feedback' });
    }
  });
};