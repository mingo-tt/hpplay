let ws;
let userName = 'pjr';
$(function (){
    if (document.cookie.indexOf("admin=123456") > -1) {
        userName = "admin";
    }
    $.ajax({
        url: "/message/list",
        type: "get",
        dataType: 'json',
        success: function (res) {
            let chatRoomHtml = '';
            res.forEach(function (message) {
                let row = '';
                let you_imgUrl = userName === 'pjr' ? "/img/friends/Judy.png" : "/img/friends/David.png";
                let other_imgUrl = userName === 'pjr' ? "/img/friends/David.png" : "/img/friends/Judy.png";
                if (message.userName === userName) {
                    row += '<div class="message_row you-message">\n' +
                        '<div class="message-content">\n' +
                        '<div class="message-text">' + message.content + '</div>\n' +
                        '<img class="head" src="' + you_imgUrl + '" alt="">\n' +
                        '<div class="message-time">' + message.createTime + '</div>\n' +
                        '</div>\n' +
                        '</div>';
                    chatRoomHtml += row;
                }else {
                    row += '<div class="message_row other-message">\n' +
                        '<div class="message-content">\n' +
                        '<img class="head" src="' + other_imgUrl + '" alt="">\n' +
                        '<div class="message-text">' + message.content + '</div>\n' +
                        '<div class="message-time">' + message.createTime + '</div>\n' +
                        '</div>\n' +
                        '</div>';
                    chatRoomHtml += row;
                }
            });
            const $chatRoom = $('#chatRoom');
            $chatRoom.html(chatRoomHtml);
            scrollChatRoom($chatRoom);
        }
    });
    $('#messageContent').keydown(function (event) {
        if (event.keyCode === 13) {
            event2SendMessage();
        }
    });
    if (window.WebSocket) {
        ws = new WebSocket("ws://10.1.121.74:8088/chat");
    }
    ws.onopen = function (evt) {
        console.log("websocket已连接");
    }
    ws.onmessage = function (evt) {
        let data = JSON.parse(evt.data);
        let imgUrl = userName === 'pjr' ? "/img/friends/David.png" : "/img/friends/Judy.png";
        if (data.systemMessage) {
            if (data.sendUser !== userName) {
                if (data.state === 1) {
                    sendSystemMessage("对方已上线", imgUrl);
                }else {
                    sendSystemMessage("对方已下线", imgUrl);
                }
            }
        }else {
            if (data.userName !== userName) {
                let row = '';
                row += '<div class="message_row other-message">\n' +
                    '<div class="message-content">\n' +
                    '<img class="head" src="' + imgUrl + '" alt="">\n' +
                    '<div class="message-text">' + data.content + '</div>\n' +
                    '<div class="message-time">' + new Date().format("yyyy-MM-dd hh:mm:ss") + '</div>\n' +
                    '</div>\n' +
                    '</div>';
                const $chatRoom = $('#chatRoom');
                $chatRoom.append(row);
                scrollChatRoom($chatRoom);
                newDanmu(data.content, imgUrl);
            }
        }
    }
    ws.onclose = function (evt) {
        console.log("websocket已关闭");
    }
    // 错误后重新链接
    ws.onerror = function () {
        ws = new WebSocket("ws://10.1.121.74:8088/chat");
    }
});

function event2SendMessage () {
    let $input = $('#messageContent');
    let messageContent = $input.val();
    let data = {userName: userName, content: messageContent};
    ws.send(JSON.stringify(data));
    $.ajax({
        url: "/add/message",
        type: "post",
        data: data,
        success: function () {
            let row = '';
            let imgUrl = '';
            if (userName === 'pjr') {
                row = '<div class="message_row you-message">\n' +
                    '<div class="message-content">\n' +
                    '<div class="message-text">' + messageContent + '</div>\n' +
                    '<img class="head" src="/img/friends/Judy.png" alt="">\n' +
                    '<div class="message-time">' + new Date().format("yyyy-MM-dd hh:mm:ss") + '</div>\n' +
                    '</div>\n' +
                    '</div>';
                imgUrl = '/img/friends/Judy.png';
            }else {
                row += '<div class="message_row you-message">\n' +
                    '<div class="message-content">\n' +
                    '<div class="message-text">' + messageContent + '</div>\n' +
                    '<img class="head" src="/img/friends/David.png" alt="">\n' +
                    '<div class="message-time">' + new Date().format("yyyy-MM-dd hh:mm:ss") + '</div>\n' +
                    '</div>\n' +
                    '</div>';
                imgUrl = "/img/friends/David.png";
            }
            const $chatRoom = $('#chatRoom');
            $chatRoom.append(row);
            scrollChatRoom($chatRoom);
            $input.val('');
            newDanmu(messageContent, imgUrl);
        }
    });
}
function sendSystemMessage(message) {
    let row = '<div class="message_row system-message">\n' +
        '<div class="message-content">\n' +
        '<div class="message-text">' + message + '</div>\n' +
        '<div class="message-time">' + new Date().format("yyyy-MM-dd hh:mm:ss") + '</div>\n' +
        '</div>\n' +
        '</div>';
    const $chatRoom = $('#chatRoom');
    $chatRoom.append(row);
    scrollChatRoom($chatRoom);
    newDanmu(message);
}

function scrollChatRoom($chatRoom) {
    let h4 = $chatRoom.prop("scrollHeight");
    $chatRoom.scrollTop(h4);
}

Date.prototype.format = function(format) {
    /*
    * 使用例子:format="yyyy-MM-dd hh:mm:ss";
    */
    let o = {
        "M+" : this.getMonth() + 1, // month
        "d+" : this.getDate(), // day
        "h+" : this.getHours(), // hour
        "m+" : this.getMinutes(), // minute
        "s+" : this.getSeconds(), // second
        "q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" : this.getMilliseconds()
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
            - RegExp.$1.length));
    }

    for (let k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}