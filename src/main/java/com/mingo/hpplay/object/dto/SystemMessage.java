package com.mingo.hpplay.object.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemMessage {
    private boolean isSystemMessage;
    private String sendUser;
    private int state;
    private int number;
}
