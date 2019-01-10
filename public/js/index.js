var socket = io();
socket.on("connect", function () {
    console.log("Connected to server");

    socket.emit('createEmail', {
        to: 'info@mmaghsoudi.ir',
        text: 'Hey, This is mmaghsoudi'
    });
});

socket.on('disconnect', function () {
    console.log('User was disconnected!');
});

socket.on('newEmail', function (email) {
    console.log("New Email", email);
});