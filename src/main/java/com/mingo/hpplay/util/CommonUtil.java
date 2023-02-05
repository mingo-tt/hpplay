package com.mingo.hpplay.util;

import com.mingo.hpplay.object.dto.User;
import org.apache.logging.log4j.util.Strings;

import javax.servlet.http.Cookie;

public class CommonUtil {
    public static boolean rightPassword(String name, String password) {
        if (Strings.isBlank(name) || Strings.isBlank(password)) {
            return false;
        }else {
            return (name.equals("admin") && password.equals("123456")) || (name.equals("pjr") && password.equals("123456"));
        }
    }

    public static User findUserByCookies(Cookie[] cookies) {
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("admin")) {
                return new User("admin", "123456");
            }
            if (cookie.getName().equals("pjr")) {
                return new User("pjr", "123456");
            }
        }
        return null;
    }
}
