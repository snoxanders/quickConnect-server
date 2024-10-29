const app = require('express')();
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: 'https://quick-connect-client.vercel.app', // Permitir o domínio do cliente
    methods: ['GET', 'POST'],                          // Métodos permitidos
    credentials: true                                  // Permitir cookies e cabeçalhos de autorização
  },
});


const PORT = process.env.PORT || 3001; 

io.on('connection',socket => {
    console.log('Usuario conectado', socket.id)

    socket.on('disconnect', reason => {
        console.log('Usuario desconectado!', socket.id)
    })

    socket.on('set_username', username => {
        socket.data.username = username        
    })

    socket.on('message', text => {
        io.emit('receive_message', {
            text,
            authorId: socket.id,
            author: socket.data.username
        })
    })
})

server.listen(PORT, '0.0.0.0', () => {
    console.log('aaaaaaa')
  console.log(`Server running on port ${PORT}`);
});