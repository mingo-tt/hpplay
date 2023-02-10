package com.mingo.hpplay.config.socket;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mingo.hpplay.object.dto.SystemMessage;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * <p></p>
 *
 * @author HuMingAn
 * @version 1.0
 **/
@ServerEndpoint(value = "/video", configurator = GetHttpSessionConfigurator.class)
@Component
public class VideoEndpoint {
    private static final Map<String, VideoEndpoint> onlineUsers = new ConcurrentHashMap<>();

    private Session session;

    private HttpSession httpSession;

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) throws JsonProcessingException {
        this.session = session;
        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        this.httpSession = httpSession;
        String userName = (String) httpSession.getAttribute("user");
        onlineUsers.put(userName, this);
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        try {
            String userName = (String) httpSession.getAttribute("user");
            for (Map.Entry<String, VideoEndpoint> entry : onlineUsers.entrySet()) {
                if (!entry.getKey().equals(userName)) {
                    entry.getValue().session.getBasicRemote().sendText(message);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnClose
    public void onClose(Session session) throws JsonProcessingException {
        String userName = (String) httpSession.getAttribute("user");
        onlineUsers.remove(userName);
    }
}
