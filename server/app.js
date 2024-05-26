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
//   socket.on('setup', async (senderId, receiverId) => {
//     console.log(senderId, receiverId);
//     const room = `private_${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
//     await socket.join(room);
//     console.log(room);
//     console.log('joined room');
//     socket.on('chat', (data) => {
//       console.log(data.room);
//       io.to(data.room).emit('chat', data);
//     });
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });
// });

io.on('connection', (socket) => {
  console.log('a user connected');

  let currentRoom = null;

  socket.on('setup', async (senderId, receiverId) => {
    if (currentRoom) {
      socket.leave(currentRoom);
    }

    currentRoom = `private_${Math.min(senderId, receiverId)}_${Math.max(senderId, receiverId)}`;
    await socket.join(currentRoom);
    console.log(`User ${senderId} joined room ${currentRoom}`);

    // Remove any previous 'chat' listener
    socket.removeAllListeners('chat');

    // Listen for chat messages
    socket.on('chat', (data) => {
      io.to(currentRoom).emit('chat', data);
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
