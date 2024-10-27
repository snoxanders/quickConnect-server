const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: [
      'https://quick-connect-client.vercel.app', 
    ],
    methods: ['GET', 'POST'], 
  },
});


const PORT = process.env.PORT || 3000; 


io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('set_username', (username) => {
    socket.data.username = username;
  });

  socket.on('message', (text) => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username || 'Anonymous', // Se o nome de usuário não for definido
    });
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('aaaaaaa')
  console.log(`Server running on port ${PORT}`);
});
