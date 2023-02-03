package com.mingo.hpplay.config;

import com.mingo.hpplay.util.CommonUtil;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;

public class LoginInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            response.sendRedirect("/login");
            return false;
        }
        boolean isLogin = Arrays.stream(cookies).anyMatch(cookie -> CommonUtil.rightPassword(cookie.getName(), cookie.getValue()));
        if (isLogin) {
            return HandlerInterceptor.super.preHandle(request, response, handler);
        }else {
            response.sendRedirect("/login");
            return false;
        }
    }
}
