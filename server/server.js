const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const port = process.env.port || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/chat', (req, res) => {
    var name = req.query.name;
    var room = req.query.room;
    res.render(publicPath + '/chat', {
        name: name,
        room: room
    });
});

var {
    generateMessage,
    generateLocationMessage
} = require('./message');

var {
    isRealString
} = require('./utils/validation');

io.on('connection', (socket) => {
    console.log('New user Connection!');

    // socket.emit('newMessage', {
    //     from: 'safir.1987@gmail.com',
    //     text: "سلام خوبی؟",
    //     created_at: 123
    // });



    socket.on('createMessage', (message) => {

        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createAt: new Date().getTime()
        });


    });

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) && !isRealString(params.room)) {
            callback('لطفا نام خود و اتاق مورد نظر را وارد کنید');
        }
        socket.join(params.room);
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

        callback();
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