package com.mingo.hpplay.util;

public enum VideoOperateEnum {
    play(1, "播放"),
    pause(2, "暂停"),
    seek(3, "跳转时间"),
    videoChange(4, "切换视频")
    ;

    VideoOperateEnum(int value, String des) {
        this.value = value;
        this.des = des;
    }

    private final int value;
    private final String des;

    public int getValue() {
        return value;
    }

    public String getDes() {
        return des;
    }
}
