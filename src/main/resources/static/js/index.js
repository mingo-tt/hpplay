let ws;
let videoWs;
let userName = 'pjr';
const host = "ws://10.1.121.74:8088";
let videoList = ['/source/video/01.mp4','/source/video/02.mp4','/source/video/03.mp4'];
let currentPlay = 0;
let player;
let sendRight = {
    play: true,
    pause: true,
    seek: true,
    changeVideo: true
}
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
    $('li').click(function () {
        $("li").removeClass("currentPlay");
        let $this = $(this);
        $this.addClass("currentPlay");
        let key = $this.attr('key');
        currentPlay = key;
        changeVideo(videoList[key]);
    });
    if (window.WebSocket) {
        ws = new WebSocket(host + "/chat");
        videoWs = new WebSocket(host + "/video");
    }
    ws.onopen = function (evt) {
        console.log("聊天频道已连接");
    }
    ws.onmessage = function (evt) {
        let data = JSON.parse(evt.data);
        let imgUrl = userName === 'pjr' ? "/img/friends/David.png" : "/img/friends/Judy.png";
        if (data.systemMessage) {
            if (data.sendUser !== userName) {
                sendSystemMessage(data, imgUrl);
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
        console.log("聊天频道已关闭");
    }
    // 错误后重新链接
    ws.onerror = function () {
        ws = new WebSocket(host + "/chat");
    }
    videoWs.onopen = function () {
        console.log("视频频道已连接")
    }
    videoWs.onclose = function () {
        console.log("视频频道已关闭")
    }
    videoWs.onmessage = function (event) {
        let data = JSON.parse(event.data);
        if (data.operateType === 1) {
            sendRight.play = false;
            player.play();
        } else if (data.operateType === 2) {
            sendRight.pause = false;
            player.pause()
        } else if (data.operateType === 3) {
            sendRight.seek = false;
            player.seek(data.seekTime);
        } else if (data.operateType === 4) {
            sendRight.changeVideo = false;
            currentPlay = data.currentPlay;
            changeVideo(videoList[data.currentPlay]);
            changeVideoSelected();
        }
    }
    videoWs.onerror = function () {
        videoWs = new WebSocket(host + "/video");
    }
    var videoObject = {
        container: '#video', //容器的ID或className
        variable: 'player',
        volume: 0, //默认音量
        //poster: 'screenshot/wdm.jpg', //封面图片地址
        autoplay: false, //是否自动播放
        loop: true, //是否循环播放
        live: false, //是否是直播
        loaded: 'loadedHandler', //当播放器加载后执行的函数
        seek: 0, //默认需要跳转的时间
        drag: '', //在flashplayer情况下是否需要支持拖动，拖动的属性是什么
        front: 'frontFun', //前一集按钮动作
        next: 'nextFun', //下一集按钮动作
        html5m3u8:true,//是否使用hls，默认不选择，如果此属性设置成true，则不能设置flashplayer:true,
        chtrack: {
            src: '/screenshot/srt.srt',
            charset: 'utf-8'
        }, //字幕文件及编码
        // preview: {
        // 	src: ['screenshot/mydream_en1800_1010_01.jpg', 'screenshot/mydream_en1800_1010_02.jpg'],
        // 	scale: 2
        // },
        //预览图片地址数组，src=图片地址数组，scale=图片截取时间间隔，单位：秒
        prompt: [{
            words: '跳过片头',
            time: 120,
        }
        ], //提示点，words=提示点的内容，time=提示点对应的时间
        video: {
            url: '/source/video/01.mp4',
            type: 'video/mp4'
        }

    };
    player = new chplayer(videoObject);


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
function sendSystemMessage(data, imgUrl) {
    let $userNumber = $("#userNumber");
    $userNumber.html("房间人数：" + data.number);
    newDanmu(data.state === 1 ? "我进来啦~" : "我退出去了", imgUrl);
}

function scrollChatRoom($chatRoom) {
    let h4 = $chatRoom.prop("scrollHeight");
    $chatRoom.scrollTop(h4);
}

function loadedHandler() {
    player.addListener('error', errorHandler); //监听视频加载出错
    player.addListener('play', playHandler); //监听暂停播放
    player.addListener('pause', pauseHandler); //监听暂停播放
    player.addListener('timeupdate', timeUpdateHandler); //监听播放时间
    player.addListener('seeking', seekingHandler); //监听跳转播放
    player.addListener('seeked', seekedHandler); //监听跳转播放完成
    player.addListener('volumechange', volumeChangeHandler); //监听音量改变
    player.addListener('full', fullHandler); //监听全屏/非全屏切换
    player.addListener('ended', endedHandler); //监听全屏/非全屏切换
    player.addListener('videochange', videoChangeHandler); //监听视频地址改变
}

function errorHandler() {
}

function playHandler() {
    if (sendRight.play) {
        let data = {
            operateType: 1,
        }
        videoWs && videoWs.send(JSON.stringify(data));
    }
    sendRight.play = true;
}

function pauseHandler() {
    if (sendRight.pause) {
        let data = {
            operateType: 2,
        }
        videoWs && videoWs.send(JSON.stringify(data));
    }
    sendRight.pause = true;
}

function timeUpdateHandler() {
}

function seekingHandler() {
    // if (sendRight.seek) {
    //     let data = {
    //         operateType: 3,
    //         seekTime: player.time,
    //     }
    //     videoWs && videoWs.send(JSON.stringify(data));
    // }
    // sendRight.seek = true;
}

function seekedHandler() {
}

function volumeChangeHandler() {
}

function fullHandler() {
}

function endedHandler() {
}

function videoChangeHandler() {

}

function videoChange2Send() {
    if (sendRight.changeVideo) {
        let data = {
            operateType: 4,
            currentPlay: currentPlay
        }
        videoWs && videoWs.send(JSON.stringify(data));
    }
    sendRight.changeVideo = true;
    sendRight.play = false;
}

function seekTime(time) {
    let metaData = player.getMetaDate();
    let duration = metaData['duration'];
    if(time < 0) {
        alert('请填写大于0的数字');
        return;
    }
    if(time > duration) {
        alert('请填写小于' + duration + '的数字');
        return;
    }
    player.seek(time);
}

function changeSize() {
    player.changeSize(w, h)
}

function frontFun() {
    if (currentPlay !== 0) {
        currentPlay --;
        changeVideo(videoList[currentPlay]);
    }
    changeVideoSelected();
}

function nextFun() {
    if (currentPlay !== videoList.length - 1) {
        currentPlay ++;
        changeVideo(videoList[currentPlay]);
    }
    changeVideoSelected();
}

function changeVideoSelected() {
    let $li = $('li');
    $li.removeClass("currentPlay");
    $('ul li').eq(currentPlay).addClass("currentPlay");
}

function newVideo() {
    changeVideo(videoUrl);
}

function newVideo2() {
    var videoUrl = player.getByElement('.videourl2').value;
    changeVideo(videoUrl);
}

function changeVideo(videoUrl) {
    if(player == null) {
        return;
    }
    let metaData = player.getMetaDate();
    let newVideoObject = {
        container: '#video', //容器的ID
        variable: 'player',
        volume: metaData['volume'],
        autoplay: true, //是否自动播放
        loaded: 'loadedHandler', //当播放器加载后执行的函数
        loop: true, //是否循环播放
        front: 'frontFun', //前一集按钮动作
        next: 'nextFun', //下一集按钮动作
        html5m3u8:true,
        chtrack: {
            src: '/screenshot/srt.srt',
            charset: 'utf-8'
        },
        prompt: [{
            words: '跳过片头',
            time: 120,
        }
        ],
        video: videoUrl
    }
    //判断是需要重新加载播放器还是直接换新地址

    if(player.playerType === 'html5video') {
        if(player.getFileExt(videoUrl) === '.flv' || player.getFileExt(videoUrl) === '.m3u8' || player.getFileExt(videoUrl) === '.f4v' || videoUrl.substr(0, 4) === 'rtmp') {
            player.removeChild();

            player = null;
            player = new chplayer();
            player.embed(newVideoObject);
        } else {
            player.newVideo(newVideoObject);
        }
    } else {
        if(player.getFileExt(videoUrl) === '.mp4' || player.getFileExt(videoUrl) === '.webm' || player.getFileExt(videoUrl) === '.ogg') {
            player = null;
            player = new chplayer();
            player.embed(newVideoObject);
        } else {
            player.newVideo(newVideoObject);
        }
    }
    // videoChange2Send();
}

function newElement() {
    var attribute = {
        list: [{
            type: 'image',
            url: 'screenshot/logo.png',
            radius: 30, //圆角弧度
            width: 30, //定义宽，必需要定义
            height: 30, //定义高，必需要定义
            alpha: 0.9, //透明度
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
            marginBottom: 10
        },
            {
                type: 'text', //说明是文本
                text: '这里是一个普通的元件，不支持HTML', //文本内容
                fontColor: '#FFFFFF',
                fontSize: 14,
                fontFamily: '"Microsoft YaHei", YaHei, "微软雅黑", SimHei,"\5FAE\8F6F\96C5\9ED1", "黑体",Arial',
                lineHeight: 30,
                alpha: 1, //透明度
                //paddingLeft:10,//左边距离
                paddingRight: 10, //右边距离
                paddingTop: 0,
                paddingBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                marginTop: 10,
                marginBottom: 0,
                //backgroundColor:'#000000',
                backAlpha: 0.5,
                backRadius: 30 //背景圆角弧度
            }
        ],
        x: 10, //x轴坐标
        y: 10, //y轴坐标
        //position:[1,1],//位置[x轴对齐方式（0=左，1=中，2=右），y轴对齐方式（0=上，1=中，2=下），x轴偏移量（不填写或null则自动判断，第一个值为0=紧贴左边，1=中间对齐，2=贴合右边），y轴偏移量（不填写或null则自动判断，0=紧贴上方，1=中间对齐，2=紧贴下方）]
        alpha: 1,
        backgroundColor: '#000000',
        backAlpha: 0.5,
        backRadius: 60 //背景圆角弧度
    }
    var el = player.addElement(attribute);
}

function newDanmu(text, logo) {
    //弹幕说明
    var danmuObj = {
        list: [{
            type: 'image',
            url: logo || '',
            radius: 30, //圆角弧度
            width: 30, //定义宽，必需要定义
            height: 30, //定义高，必需要定义
            alpha: 0.9, //透明度
            marginLeft: 10,
            marginRight: 10,
            marginTop: 0,
            marginBottom: 0
        },
            {
                type: 'text', //说明是文本
                text: text,
                fontColor: '#FFFFFF',
                fontSize: 14,
                fontFamily: '"Microsoft YaHei", YaHei, "微软雅黑", SimHei,"\5FAE\8F6F\96C5\9ED1", "黑体",Arial',
                lineHeight: 30,
                alpha: 1, //透明度
                paddingLeft: 10, //左边距离
                paddingRight: 10, //右边距离
                paddingTop: 0,
                paddingBottom: 0,
                marginLeft: 0,
                marginRight: 0,
                marginTop: 0,
                marginBottom: 0,
                backgroundColor: '#000000',
                backAlpha: 0.5,
                backRadius: 30 //背景圆角弧度
            }
        ],
        x: '100%', //x轴坐标
        y: "50%", //y轴坐标
        //position:[2,1,0],//位置[x轴对齐方式（0=左，1=中，2=右），y轴对齐方式（0=上，1=中，2=下），x轴偏移量（不填写或null则自动判断，第一个值为0=紧贴左边，1=中间对齐，2=贴合右边），y轴偏移量（不填写或null则自动判断，0=紧贴上方，1=中间对齐，2=紧贴下方）]
        alpha: 1,
        //backgroundColor:'#FFFFFF',
        backAlpha: 0.8,
        backRadius: 30 //背景圆角弧度
    }
    var danmu = player.addElement(danmuObj);
    var danmuS = player.getElement(danmu);
    var obj = {
        element: danmu,
        parameter: 'x',
        static: true, //是否禁止其它属性，true=是，即当x(y)(alpha)变化时，y(x)(x,y)在播放器尺寸变化时不允许变化
        effect: 'None.easeOut',
        start: null,
        end: -danmuS['width'],
        speed: 10,
        overStop: false,
        pauseStop: false,
        callBack: 'deleteChild'
    };
    var danmuAnimate = player.animate(obj);
}

function deleteChild(ele) {
    if(player) {
        player.deleteElement(ele);
    }
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