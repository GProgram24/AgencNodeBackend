import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:7000';

// EditorMakeanIdea connection handler
export const contentEditController = (socket, taskId, editorId) => {
  // Idea setup event handler
  socket.on('initialContext', async (message) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/idea/edit/init`, {
        user_id: editorId, // User id to manage memory chain on fastapi
        task_id: taskId
      });
      socket.emit('initialContextResponse', response.data);
    } catch (error) {
      console.error('Error in initialContext:', error);
      socket.emit('error', { message: 'Error processing initial context' });
    }
  });

  // Feedback event handler
  socket.on('feedback', async (feedbackData) => {
    try {
      const response = await axios.post(`${FASTAPI_URL}/idea/edit/feedback`, {
        user_id: editorId, // User id to manage memory chain on fastapi
        feedback: feedbackData.feedback,
        selection: feedbackData?.selection || null
      });
      socket.emit('feedbackResponse', response.data);
    } catch (error) {
      console.error('Error in feedback:', error);
      socket.emit('error', { message: 'Error processing feedback' });
    }
  });
};
