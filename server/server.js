const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.port || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var {
    generateMessage,
    generateLocationMessage
} = require('./message');

io.on('connection', (socket) => {
    console.log('New user Connection!');

    // socket.emit('newMessage', {
    //     from: 'safir.1987@gmail.com',
    //     text: "سلام خوبی؟",
    //     created_at: 123
    // });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the chat app',
        createAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createAt: new Date().getTime()
        });

        // socket.broadcast.emit('newMessage', {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    // io.emit('hello', ' world');
    // io.emit('hi', 'how are you?');

    socket.on('disconnect', () => {
        console.log('User was disconnected!');
    });
})

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});