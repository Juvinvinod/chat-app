const { createServer } = require('http');
const { Server } = require('socket.io');

const express = require('express');
const cors = require('cors');

const userRouter = require('./routes/userRoutes');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:4200'],
  },
});

// io.on('connection', (socket) => {
//   console.log('a user connected');

//   let currentRoom = null;

//   socket.on('setup', async (senderId, receiverId) => {
//     if (currentRoom) {
//       socket.leave(currentRoom);
//     }

//     currentRoom = `private_${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
//     await socket.join(currentRoom);
//     console.log(`User ${senderId} joined room ${currentRoom}`);

//     // Remove any previous 'chat' listener
//     socket.removeAllListeners('chat');

//     // Listen for chat messages
//     socket.on('chat', (data) => {
//       io.to(currentRoom).emit('chat', data);
//     });

//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });
// });

const messages = {}; // In-memory store for messages

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('setup', async (senderId, receiverId) => {
    const room = `private_${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
    await socket.join(room);
    console.log(`User ${senderId} joined room ${room}`);

    // Fetch previously sent messages for the room
    if (messages[room]) {
      socket.emit('previousMessages', messages[room]);
    }
    socket.removeAllListeners('chat');
    socket.on('chat', (data) => {
      const messageRoom = `private_${Math.min(data.senderId, data.receiverId)}_${Math.max(data.senderId, data.receiverId)}`;
      if (!messages[messageRoom]) {
        messages[messageRoom] = [];
      }
      messages[messageRoom].push(data);

      io.to(messageRoom).emit('chat', data);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', userRouter);

module.exports = httpServer;
