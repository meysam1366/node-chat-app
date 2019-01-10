const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.port || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
    console.log('New user Connection!');

    socket.emit('newEmail', {
        from: 'safir.1987@gmail.com',
        text: "سلام خوبی؟",
        created_at: 123
    });

    socket.on('createEmail', (email) => {
        console.log("Create Email", email);
    });

    io.emit('hello', ' world');
    io.emit('hi', 'how are you?');

    socket.on('disconnect', () => {
        console.log('User was disconnected!');
    });
})

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});