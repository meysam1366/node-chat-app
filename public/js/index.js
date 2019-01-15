var socket = io();
socket.on("connect", function () {
    console.log("Connected to server");

    // socket.emit('createMessage', {
    //     from: 'maghsoudi@mmaghsoudi.ir',
    //     text: "Hey, it's work"
    // });
});

socket.on('disconnect', function () {
    console.log('User was disconnected!');
});

socket.on('newMessage', function (message) {
    console.log("New Message", message);

    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $('#messages').append(li);
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: "User",
        text: $('[name=message]').val()
    });
    $('[name=message]').val('')
});