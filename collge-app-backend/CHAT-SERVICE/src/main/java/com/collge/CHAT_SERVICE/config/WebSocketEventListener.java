package com.collge.CHAT_SERVICE.config;

import com.collge.CHAT_SERVICE.pojos.UserDataFromSocket;
import org.checkerframework.checker.units.qual.A;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private final ActiveUserTracker activeUserTracker;

    public WebSocketEventListener(ActiveUserTracker activeUserTracker) {
        this.activeUserTracker = activeUserTracker;
    }

    @EventListener
    public void handleSessionConnected(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        UserDataFromSocket socketData = getUserDataFromHeaders(headerAccessor, event); // Implement logic to extract user ID
        activeUserTracker.connectUser(socketData);
    }

//    @EventListener
//    public void handleSessionDisconnected(SessionDisconnectEvent event) {
//
//        String token = AuthorizationContextHolder.getAuthorizationHeader();
//        Long userIdToDisconnect = activeUserTracker.getUserIdByToken(token.substring(7));
//
//        activeUserTracker.disconnectUser(userIdToDisconnect);
//
//    }

    private UserDataFromSocket getUserDataFromHeaders(StompHeaderAccessor headerAccessor, SessionConnectedEvent event) {

        UserDataFromSocket userDataFromSocket = new UserDataFromSocket();

        MessageHeaderAccessor messageHeaderAccessor =
                MessageHeaderAccessor.getAccessor(event.getMessage().getHeaders(), MessageHeaderAccessor.class);

        StompHeaderAccessor stompHeaderAccessor = MessageHeaderAccessor.getAccessor(
                (Message<?>) headerAccessor.getHeader("simpConnectMessage"),
                StompHeaderAccessor.class);

        if(stompHeaderAccessor != null){
            String userId = stompHeaderAccessor.getNativeHeader("userId").get(0);
            String refreshToken = stompHeaderAccessor.getNativeHeader("Authorization").get(0);
            String recipientId = stompHeaderAccessor.getNativeHeader("recipientId").get(0);

            userDataFromSocket = UserDataFromSocket.builder()
                    .userId(Long.parseLong(userId))
                    .refreshToken(refreshToken)
                    .recipientId(Long.parseLong(recipientId))
                    .build();
        }
        return userDataFromSocket;
    }

    private UserDataFromSocket getUserDataFromHeaders(StompHeaderAccessor headerAccessor, SessionDisconnectEvent event) {

        UserDataFromSocket userDataFromSocket = new UserDataFromSocket();

        MessageHeaderAccessor messageHeaderAccessor =
                MessageHeaderAccessor.getAccessor(event.getMessage().getHeaders(), MessageHeaderAccessor.class);

        StompHeaderAccessor stompHeaderAccessor = MessageHeaderAccessor.getAccessor(
                (Message<?>) headerAccessor.getHeader("simpConnectMessage"),
                StompHeaderAccessor.class);

        if(stompHeaderAccessor != null){
            String userId = stompHeaderAccessor.getNativeHeader("userId").get(0);
            String refreshToken = stompHeaderAccessor.getNativeHeader("Authorization").get(0);
            String recipientId = stompHeaderAccessor.getNativeHeader("recipientId").get(0);

            userDataFromSocket = UserDataFromSocket.builder()
                    .userId(Long.parseLong(userId))
                    .refreshToken(refreshToken)
                    .recipientId(Long.parseLong(recipientId))
                    .build();
        }
        return userDataFromSocket;
    }


}
