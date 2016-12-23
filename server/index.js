/**
 * Created by nimdanoob on 2016/12/22.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var onlineUsers = {};

io.on('connection', function (socket) {
    //test ?一个用户 创建一个 socket
    console.log('a user connected');

    socket.on('login', function (obj) {
        socket.name = obj.userid;

        if (!onlineUsers.includes(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            //add online user
        }
        io.emit('login', {onlineUsers: onlineUsers, user: obj});
        console.log(obj.username + '加入了聊天室');
    });

    socket.on('disconnect', function () {
        if (onlineUsers.includes(socket.name)) {
            delete onlineUsers[socket.name];
            io.emit('logout', {onlineUsers: onlineUsers, user: obj});
            console.log(obj.username + '退出了聊天室')
        }
    });

    socket.on('message', function (obj) {
        io.emit('message', obj);
        console.log(obj.username + '说: ' + obj.content);
    });

});

http.listen('3000', function () {
    console.log('listening on *:3000');
});


