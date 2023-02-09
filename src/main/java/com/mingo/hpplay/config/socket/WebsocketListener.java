package com.mingo.hpplay.config.socket;

import com.mingo.hpplay.object.dto.User;
import com.mingo.hpplay.util.CommonUtil;
import org.springframework.stereotype.Component;

import javax.servlet.ServletRequestEvent;
import javax.servlet.ServletRequestListener;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * <p></p>
 *
 * @author HuMingAn
 * @version 1.0
 **/
@Component
public class WebsocketListener implements ServletRequestListener {
    @Override
    public void requestInitialized(ServletRequestEvent sre) {
        HttpSession session = ((HttpServletRequest) sre.getServletRequest()).getSession();
        Cookie[] cookies = ((HttpServletRequest) sre.getServletRequest()).getCookies();
        if (cookies != null) {
            User user = CommonUtil.findUserByCookies(cookies);
            session.setAttribute("user", user != null ? user.getName() : "admin");
        }
    }

    public WebsocketListener() {
    }

    @Override
    public void requestDestroyed(ServletRequestEvent sre) {}
}
