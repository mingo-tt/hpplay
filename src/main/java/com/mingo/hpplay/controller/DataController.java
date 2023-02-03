package com.mingo.hpplay.controller;

import com.mingo.hpplay.object.dto.User;
import com.mingo.hpplay.util.CommonUtil;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

@RestController
public class DataController {

    @PostMapping("/login/info")
    public String login (User user, HttpServletResponse response) {
        boolean rightPassword = CommonUtil.rightPassword(user.getName(), user.getPassword());
        if (rightPassword) {
            Cookie cookie = new Cookie(user.getName(), user.getPassword());
            cookie.setMaxAge(24 * 60 * 60 * 30);
            cookie.setPath("/");
            response.addCookie(cookie);
            return "success";
        }else {
            return "fail";
        }
    }
}
