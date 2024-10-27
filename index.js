const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: { origin: 'https://quickconnect-client.vercel.app' }  
});

const PORT = process.env.PORT || 3001;  

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('disconnect', (reason) => {
    console.log('User disconnected', socket.id);
  });

  socket.on('set_username', (username) => {
    socket.data.username = username;
  });

  socket.on('message', (text) => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
