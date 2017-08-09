var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    //Node.js中使用socket的一个包。
    //使用它可以很方便地建立服务器到客户端的sockets连接，发送事件与接收特定事件。
    // 这样我们就可以在前端使用socket.io与服务器进行通信了。
    io = require('socket.io').listen(server),
    users = [];

app.use('/', express.static(__dirname + '/www'));

server.listen(process.env.PORT || 3000);

io.sockets.on('connection', function(socket) {
    //new user login
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            // io.sockets.emit('system', nickname, users.length, 'login');
        };
    });

    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });

});
