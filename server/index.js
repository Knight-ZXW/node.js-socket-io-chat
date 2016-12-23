/**
 * Created by nimdanoob on 2016/12/22.
 */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;
io.on('connection', function (socket) {
    //test ?一个用户 创建一个 socket
    console.log('a user connected');

    socket.on('login', function (obj) {
        socket.name = obj.userid;

        if (!onlineUsers.hasOwnProperty(obj.userid)) {
            onlineUsers[obj.userid] = obj.username;
            onlineCount++;
        }
        io.emit('loginSuccess', {onlineUsers: onlineUsers, user: obj,onlineCount:onlineCount});
        console.log(obj.username + '加入了聊天室');
    });

    socket.on('disconnect', function () {
        if (onlineUsers.hasOwnProperty(socket.name)) {
            var obj = {userid: socket.name, username: onlineUsers[socket.name]};
            delete onlineUsers[socket.name];
            onlineCount--;
            io.emit('logout', {onlineUsers: onlineUsers, user: obj,onlineCount:onlineCount});
            console.log(obj.username + '退出了聊天室')
        }
    });

    socket.on('message', function (obj) {
        io.emit('message', obj);
        console.log(obj.username + '说: ' + obj.content);
    });

});
app.use('/static', express.static('static'));
app.get('/', function (req, res) {
    res.sendFile(path.resolve(__dirname + '/index.html'));
});

http.listen('3000', function () {
    console.log('listening on *:3000');
});


