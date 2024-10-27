const express = require('express');
const app = express();
const server = require('http').createServer(app);

// Configuração do Socket.IO com CORS
const io = require('socket.io')(server, {
  cors: { origin: 'https://quickconnect-client.vercel.app' }  // Permitir acesso da URL do front-end
});

// Usar a porta fornecida pelo Railway ou 3001 como fallback
const PORT = process.env.PORT || 3001;  

io.on('connection', (socket) => {
  console.log('User connected', socket.id);  // Log quando um usuário se conecta

  socket.on('disconnect', (reason) => {
    console.log('User disconnected', socket.id);  // Log quando um usuário se desconecta
  });

  socket.on('set_username', (username) => {
    socket.data.username = username;  // Armazenar o nome de usuário na conexão do socket
  });

  socket.on('message', (text) => {
    // Emitir a mensagem recebida para todos os clientes conectados
    io.emit('receive_message', {
      text,
      authorId: socket.id,
      author: socket.data.username
    });
  });
});

// Iniciar o servidor na porta especificada
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);  // Log para confirmar que o servidor está rodando
});
