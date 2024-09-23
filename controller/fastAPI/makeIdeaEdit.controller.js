import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// EditorMakeanIdea connection handler
export const contentEditController = (socket) => {
    // Context setup event handler for editor chat
    socket.on('initialContext', (message) => {
      console.log(`Initial context received in /editorMakeanIdea from ${socket.id}: ${message}`);
      socket.emit('initialContextResponse', `Server (editorMakeanIdea) received your message: ${message}`);
    });
  
    // Feedback event handler to modify content
    socket.on('feedback', (feedbackData) => {
      console.log(`Feedback received in /editorMakeanIdea from ${socket.id}: ${feedbackData}`);
      socket.emit('feedbackResponse', `Server (editorMakeanIdea) received your feedback: ${feedbackData}`);
    });
  };