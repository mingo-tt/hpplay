package com.mingo.hpplay.util;

import org.apache.logging.log4j.util.Strings;

public class CommonUtil {
    public static boolean rightPassword(String name, String password) {
        if (Strings.isBlank(name) || Strings.isBlank(password)) {
            return false;
        }else {
            return (name.equals("admin") && password.equals("123456")) || (name.equals("pjr") && password.equals("123456"));
        }
    }
}
