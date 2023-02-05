package com.mingo.hpplay.config.socket;

import javax.servlet.http.HttpSession;
import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

/**
 * <p></p>
 *
 * @author HuMingAn
 * @version 1.0
 **/
public class GetHttpSessionConfigurator extends ServerEndpointConfig.Configurator {
    @Override
    public void modifyHandshake(ServerEndpointConfig config, HandshakeRequest request, HandshakeResponse response) {
        HttpSession httpSession = (HttpSession) request.getHttpSession();
        if (httpSession != null) {
            config.getUserProperties().put(HttpSession.class.getName(),httpSession);
        }
        super.modifyHandshake(config, request, response);
    }
}
