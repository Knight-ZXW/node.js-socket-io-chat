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
        msgObj:d.getElementById("message"),//输入内容
        screenheight:w.innerHeight ? w.innerHeight : dx.clientHeight,
        username: null,
        userid: null,
        socket:null,
        scrollToBottom:function () {
            w.scrollTo(0,this.msgObj.clientHeight);
        },
        logout:function () {
            //dosconnect socket
            this.socket.disconnect();
            location.reload();
        }

    }

})();