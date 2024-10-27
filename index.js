const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://quick-connect-client.vercel.app', // URL do seu cliente
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Definindo a porta do servidor
const PORT = process.env.PORT || 3001;

// Mensagem de log para confirmar a porta
if (!process.env.PORT) {
  console.warn('Usando a porta padrão 3001. Configure a variável de ambiente PORT.');
}

// Rota raiz para verificação rápida do status do servidor
app.get('/', (req, res) => {
  res.send('Servidor Socket.IO está ativo');
});

// Configuração dos eventos do Socket.IO
io.on('connection', (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  socket.on('disconnect', (reason) => {
    console.log(`Usuário desconectado: ${socket.id}, motivo: ${reason}`);
  });

  socket.on('set_username', (username) => {
    socket.data.username = username;
    console.log(`Usuário ${socket.id} definiu o nome como: ${username}`);
  });

  socket.on('message', (text) => {
    const messageData = {
      text,
      authorId: socket.id,
      author: socket.data.username || 'Anônimo', // Nome de autor padrão
    };
    io.emit('receive_message', messageData);
    console.log('Mensagem enviada:', messageData);
  });
});

// Iniciando o servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
