let ws;
const userName = 'pjr';
$(function (){
    console.log(document.cookie);
    $.ajax({
        url: "/message/list",
        type: "get",
        dataType: 'json',
        success: function (res) {
            let chatRoomHtml = '';
            res.forEach(function (message) {
                let row = '';
                if (message.userName === userName) {
                    row += '<div class="message_row you-message">\n' +
                        '<div class="message-content">\n' +
                        '<div class="message-text">' + message.content + '</div>\n' +
                        '<img class="head" src="/img/friends/Judy.png" alt="">\n' +
                        '<div class="message-time">' + message.createTime + '</div>\n' +
                        '</div>\n' +
                        '</div>';
                    chatRoomHtml += row;
                }else {
                    row += '<div class="message_row other-message">\n' +
                        '<div class="message-content">\n' +
                        '<img class="head" src="/img/friends/David.png" alt="">\n' +
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
        ws = new WebSocket("ws://192.168.101.3:8088/chat");
    }
    ws.onopen = function (evt) {
        console.log(evt);
        alert("websocket已连接");
    }
    ws.onmessage = function (evt) {
        // let data = JSON.parse(evt.data);
        console.log(evt);
    }
    ws.onclose = function (evt) {
        console.log(evt);
        alert("websocket已关闭");
    }
});

function event2SendMessage () {
    let $input = $('#messageContent');
    let messageContent = $input.val();
    let row = '<div class="message_row you-message">\n' +
        '<div class="message-content">\n' +
        '<div class="message-text">' + messageContent + '</div>\n' +
        '<img class="head" src="/img/friends/Judy.png" alt="">\n' +
        '<div class="message-time">' + new Date().format("yyyy-MM-dd hh:mm:ss") + '</div>\n' +
        '</div>\n' +
        '</div>';
    const $chatRoom = $('#chatRoom');
    $chatRoom.append(row);
    scrollChatRoom($chatRoom);
    $input.val('');
    newDanmu(messageContent, '/img/friends/Judy.png');
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