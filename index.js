const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

// Configuração do Socket.IO com CORS
const io = socketIo(server, {
  cors: {
    origin: [
      'https://quick-connect-client.vercel.app', // URL do cliente na Vercel
      // Você pode adicionar outras origens aqui se necessário
    ],
    methods: ['GET', 'POST'], // Métodos permitidos
    credentials: true, // Permitir cookies e cabeçalhos de autorização
  },
});

// Defina uma porta padrão, se PORT não estiver definido
const PORT = process.env.PORT || 3000; // Altere 3000 para a porta desejada

// Evento quando um usuário se conecta
io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  // Evento para definir o nome de usuário
  socket.on('set_username', (username) => {
    socket.data.username = username;
  });

  // Evento para receber mensagens
  socket.on('message', (text) => {
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username || 'Anonymous', // Se o nome de usuário não for definido
    });
  });

  // Evento quando um usuário se desconecta
  socket.on('disconnect', (reason) => {
    console.log('User disconnected', socket.id);
  });
});

// Inicie o servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
