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

const messages = {}; // In-memory store for messages

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('setup', async (room) => {
    console.log(room);
    await socket.join(room);

    // Fetch previously sent messages for the room
    if (messages[room]) {
      socket.emit('previousMessages', messages[room]);
    }
    socket.removeAllListeners('chat');
    socket.removeAllListeners('image');
    socket.on('chat', (data) => {
      const messageRoom = data.room;
      if (!messages[messageRoom]) {
        messages[messageRoom] = [];
      }
      messages[messageRoom].push(data);

      io.to(messageRoom).emit('chat', data);
    });

    socket.on('image', (data) => {
      const { image, senderId, receiverId, room } = data;
      if (!messages[room]) {
        messages[room] = [];
      }
      messages[room].push({ image, senderId, receiverId, room });
      io.to(room).emit('chat', { image, senderId, receiverId, room });
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
