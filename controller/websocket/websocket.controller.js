// EditorMakeanIdea connection handler
export const contentEditHandler = (socket) => {
  // Initial message handler
  socket.on('initialMessage', (message) => {
    console.log(`Initial message received in /editorMakeanIdea from ${socket.id}: ${message}`);
    socket.emit('initialMessageResponse', `Server (editorMakeanIdea) received your message: ${message}`);
  });

  // Feedback handler
  socket.on('feedback', (feedbackData) => {
    console.log(`Feedback received in /editorMakeanIdea from ${socket.id}: ${feedbackData}`);
    socket.emit('feedbackResponse', `Server (editorMakeanIdea) received your feedback: ${feedbackData}`);
  });
};

// Brainstorm connection handler
export const brainstormHandlers = (socket) => {
  // Initial message handler
  socket.on('initialMessage', (message) => {
    console.log(`Initial message received in /brainstorm from ${socket.id}: ${message}`);
    socket.emit('initialMessageResponse', `Server (brainstorm) received your message: ${message}`);
  });

  // Feedback handler
  socket.on('feedback', (feedbackData) => {
    console.log(`Feedback received in /brainstorm from ${socket.id}: ${feedbackData}`);
    socket.emit('feedbackResponse', `Server (brainstorm) received your feedback: ${feedbackData}`);
  });
};

