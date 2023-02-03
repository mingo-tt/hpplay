package com.mingo.hpplay.object.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class User implements Serializable {
    private String name;
    private String password;
}
