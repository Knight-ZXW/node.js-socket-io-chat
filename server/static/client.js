/**
 * Created by nimdanoob on 2016/12/23.
 */
(function () {
    var d = document,
        w = window,
        p = parseInt,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode === 'CSS1Compat',
        dx = dc ? dd : db,
        ex = encodeURIComponent;

    w.CHAT = {
        msgObj: d.getElementById("message"),//输入内容
        screenheight: w.innerHeight ? w.innerHeight : dx.clientHeight,
        username: null,
        userid: null,
        socket: null,
        scrollToBottom: function () {
            w.scrollTo(0, this.msgObj.clientHeight);
        },
        logout: function () {
            //dosconnect socket
            this.socket.disconnect();
            location.reload();
        },
        submit: function () {
            var content = d.getElementById('content').value;
            if (content != null) {
                var obj = {
                    userid: this.userid,
                    username: this.username,
                    content: content
                };
                //reset input
                this.socket.emit('message', obj);
                d.getElementById('content').value = '';
            }
            //un use
            return false;
        },
        getUid: function () {
            return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
        },
        updateSysMsg: function (o, action) { //更新系统消息，比如有新的用户进入聊天室，或者用户退出
            var onlineUsers = o.onlineUsers;
            var onlineCount = onlineUsers.length;
            var user = o.user;

            //更新在线人数
            var userhtml = '';
            var separator = '';

            for (key in onlineUsers) {
                if (onlineUsers.hasOwnProperty(key)) {
                    userhtml += separator + onlineUsers[key];
                    separator = '、';
                }
            }

            d.getElementById("onlinecount").innerHTML = '当前共有' + onlineUsers.length + '人在线，在线列表' + userhtml;
            //添加系统信息
            var html = '';
            html += '<div class ="msg-system">';
            html += user.username;
            html += (action == 'loginSuccess') ? '加入了聊天室' : '退出了聊天室';
            html += '</div>';
            var section = d.createElement('section');
            section.className = 'system J-mjrlinkWrap J-cutMsg';
            section.innerHTML = html;
            this.msgObj.appendChild(section);
            this.scrollToBottom();
        },

        usernameSubmit: function () {//提交用户名
            var username = d.getElementById('username').value;
            if (username != "") {
                d.getElementById("username").value = "";
                d.getElementById("loginbox").style.display = 'none';
                d.getElementById("chatbox").style.display = "block";
                this.init(username);
            }
            return false;
        },
        init: function (username) {
            this.userid = this.getUid();
            this.username = username;
            d.getElementById("showusername").innerHTML = this.username;
            this.scrollToBottom();

            //connect backend socket,use default address ,if use detail address, like 'ws//localhost.com'
            this.socket = io.connect();
            // emit login action to backend
            this.socket.emit('login', {userid: this.userid, username: this.username});
            //listen on loginSuccess action
            this.socket.on('loginSuccess', function (o) {
                CHAT.updateSysMsg(o, 'loginSuccess');
            });
            //listen user logout
            this.socket.on('logout', function (o) {
                CHAT.updateSysMsg(o, 'logout');
            });

            this.socket.on('message', function (obj) {
                //is self message ?
                var isme = (obj.userid == CHAT.userid);
                var contentDiv = '<div>' + obj.content + '</div>';
                var usernameDiv = '<span>' + obj.username + '</span>';

                var section = d.createElement('section');
                if (isme){
                    section.className = 'user';
                    section.innerHTML = contentDiv + usernameDiv;
                } else {
                    section.className = 'service';
                    section.innerHTML = usernameDiv + contentDiv;
                }
                CHAT.msgObj.appendChild(section);
                CHAT.scrollToBottom();
            });
        }
    };
    d.getElementById('username').onkeydown = function (e) {
        e = e || event;
        if (e.keyCode == 13) {
            CHAT.usernameSubmit();
        }
    };
    d.getElementById('content').onkeydown = function (e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.submit();
        }
    }


})();