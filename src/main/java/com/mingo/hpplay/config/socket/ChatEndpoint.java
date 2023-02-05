package com.mingo.hpplay.config.socket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mingo.hpplay.object.entity.ChatMessage;
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
@ServerEndpoint(value = "/chat", configurator = GetHttpSessionConfigurator.class)
@Component
public class ChatEndpoint {
    private static final Map<String, ChatEndpoint> onlineUsers = new ConcurrentHashMap<>();

    private Session session;

    private HttpSession httpSession;

    @OnOpen
    public void onOpen(Session session, EndpointConfig config) {
        this.session = session;
        HttpSession httpSession = (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        this.httpSession = httpSession;
        String userName = (String) httpSession.getAttribute("user");
        onlineUsers.put(userName, this);
        broadcastAllUsers("isOpen");
    }

    private void broadcastAllUsers(String message) {
        try {
            Set<String> names = onlineUsers.keySet();
            for (String name : names) {
                ChatEndpoint chatEndpoint = onlineUsers.get(name);
                chatEndpoint.session.getBasicRemote().sendText(message);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ChatMessage chatMessage = mapper.readValue(message, ChatMessage.class);
            String userName = (String) httpSession.getAttribute("user");
            for (Map.Entry<String, ChatEndpoint> entry : onlineUsers.entrySet()) {
                if (!entry.getKey().equals(userName)) {
                    entry.getValue().session.getBasicRemote().sendText(message);
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @OnClose
    public void onClose(Session session) {
        String userName = (String) httpSession.getAttribute("user");
        onlineUsers.remove(userName);
        broadcastAllUsers("onClose");
    }
}
