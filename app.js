const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:pass@comp3123cluster.arhm6.mongodb.net/comp3133_101400506_lab_Test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const groupMessage = require('./Schemas/Group Message');


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for incoming chat messages
  socket.on('chat message', (data) => {
    console.log('Received message:', data);

    // Save the message to MongoDB
    const message = new groupMessage({ user: data.user, text: data.message });
    message.save((err) => {
      if (err) {
        console.error('Error saving message to database:', err);
      } else {
        console.log('Message saved to the database');
      }
    });

    // Broadcast the message to all connected clients
    io.emit('chat message', data);
  });

  // Listen for user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.static('public'));
