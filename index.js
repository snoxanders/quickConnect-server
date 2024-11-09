const express = require('express');
const http = require('http')
const socketIo = require('socket.io')

//(server, {cors: {origin: '*', methods: ["GET", "POST"]}})

const PORT = process.env.PORT || 3001; 

const app = express()

const server = http.createServer(app);
const io = socketIo(server)


app.get('/', (req, res) => {
  res.send('Servidor rodando!');
});



io.on('connection',socket => {
    console.log('Usuario conectado', socket.id)

    socket.on('disconnect', reason => {
        console.log('Usuario desconectado', socket.id)
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
