package com.mingo.hpplay.object.vo;

import lombok.Data;

/**
 * <p></p>
 *
 * @author HuMingAn
 * @version 1.0
 **/
@Data
public class ChatMessageVO {
    private Long messageId;

    private String userName;

    private String content;

    private String createTime;
}
