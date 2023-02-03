package com.mingo.hpplay.controller;

import com.mingo.hpplay.util.CommonUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;

/**
 * <p></p>
 *
 * @author HuMingAn
 * @version 1.0
 **/
@Controller
public class IndexController {

    @RequestMapping("/app/index")
    public String index () {
        return "index";
    }

    @RequestMapping("/login")
    public String login (HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        boolean isLogin = Arrays.stream(cookies).anyMatch(cookie -> CommonUtil.rightPassword(cookie.getName(), cookie.getValue()));
        if (isLogin) {
            return "redirect:/app/index";
        }else {
            return "login";
        }
    }
}
