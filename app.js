const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const User = require('./Schemas/Users')
const crypto = require('crypto');

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
  /*
  This Works by checking if no user exsists with that Username 
  If their is no User create a new User
  If their is a User thorw an Error 
  */
  socket.on('signUp', async (data) => {    
    try {
      if(User.find({username: data.username}) == null){
        const newUser = new User({
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
          password: crypto.createHash('md5').update(data.password).digest('hex'),
        });
        await newUser.save();
        console.log("New user saved:", newUser);
      } else {
        throw new Error("Username already in use")
      }    
    } catch (error) {
      console.error("Error saving user:", error);
    }
  });
  
  // Listen for Login Function 
  socket.on("login", async(data) => {
    try {
      const user = User.findOne(
        {
          username: data.username, 
          password: crypto.createHash('md5').update(data.password).digest('hex')
        })

      if(user != null) 
        {
          socket.emit("loginResponse", { user: {
             username: user.username, 
             firstname: user.firstname, 
             lastname: user.lastname } });
        } else {
          throw new Error("Invalid User Credentials")
        }
    } catch (error) {
      
    }
  })
  
  // Listen for user disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(express.static('public'));
