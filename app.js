const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const User = require('./Schemas/Users')

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:pass@comp3123cluster.arhm6.mongodb.net/comp3133_101400506_lab_Test?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
const PORT = 3000;

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}/`);
  console.log(`http://localhost:${PORT}/signUp"`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/view/index.html')
})

app.get("/signUp", (req, res) => {
  res.sendFile(__dirname + '/view/signup.html')
})


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for User Creation event 
  socket.on('signUp', async (data) => {
    try {      
      const newUser = new User({
        username: data.username,
        firstname: data.firstname,
        lastname: data.lastname,
        password: data.password,
      });
      await newUser.save();
      console.log("New user saved:", newUser);
    } catch (error) {
      console.error("Error saving user:", error);
    }
});

    // Listen for user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.static('public'));
