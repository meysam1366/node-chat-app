var socket = io();

function scrollFunction() {
    // Selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on("connect", function () {
    console.log("Connected to server");

    // socket.emit('createMessage', {
    //     from: 'maghsoudi@mmaghsoudi.ir',
    //     text: "Hey, it's work"
    // });
    var params = $.deparam(window.location.search);
    socket.emit('join', params, function (err) {
        if (err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log('Not error');
        }
    });
});

socket.on('disconnect', function () {
    console.log('User was disconnected!');
});

socket.on('newMessage', function (message) {
    var formatedTime = moment(message.createdAt).format('hh:mm a')
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        text: message.text,
        formatedTime: formatedTime
    });
    $('#messages').append(html);
    scrollFunction();
});

$('#message-form').on('submit', function (e) {
    e.preventDefault();

    var message = $('[name=message]');

    socket.emit('createMessage', {
        from: "User",
        text: message.val()
    });
    message.val('');
});

var locationButton = $('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert("Geolocation not supported by your browser");
    }

    locationButton.attr('disabled', true).text('Sending Location ...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });
        console.log(position);
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location');
        alert('Unable to fetch location');
    });
});

socket.on('newLocationMessage', function (message) {
    var formatedTime = moment(message.createdAt).format('hh:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        formatedTime: formatedTime
    });
    $('#messages').append(html);
    scrollFunction();
});