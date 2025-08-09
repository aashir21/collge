package com.collge.CHAT_SERVICE.controller;


import com.collge.CHAT_SERVICE.DTO.CreateNotificationDTO;
import com.collge.CHAT_SERVICE.DTO.NewChatMessageDTO;
import com.collge.CHAT_SERVICE.config.ActiveUserTracker;
import com.collge.CHAT_SERVICE.config.AuthorizationContextHolder;
import com.collge.CHAT_SERVICE.model.ChatMessage;
import com.collge.CHAT_SERVICE.model.ChatNotification;
import com.collge.CHAT_SERVICE.repository.NotificationRepository;
import com.collge.CHAT_SERVICE.service.ChatMessageService;
import com.collge.CHAT_SERVICE.service.ChatRoomService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/v1/chat")
public class MessageController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageService chatMessageService;

    @Autowired
    private ChatRoomService chatRoomService;

    @Autowired
    private ActiveUserTracker activeUserTracker;

    @Autowired
    private NotificationRepository notificationRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(MessageController.class);

    @MessageMapping("/chat")
    public void processMessage(
            @Payload NewChatMessageDTO newChatMessageDTO
            ){
        ChatMessage savedMsg = chatMessageService.save(newChatMessageDTO);

        String queueName = "/queue/messages";

        ChatNotification chatNotification = chatMessageService.createChatMessage(savedMsg);

        Long recipientId = newChatMessageDTO.getRecipientId();
        Long senderId = newChatMessageDTO.getSenderId();

        // Check the connection status and active chat context
        boolean isRecipientConnected = activeUserTracker.isUserConnected(recipientId);
        Long activeChatUserId = activeUserTracker.getActiveChat(recipientId);
        boolean isRecipientActivelyChattingWithSender = activeChatUserId != null && activeChatUserId.equals(senderId);

        String userToken = activeUserTracker.getRefreshToken(senderId);
        AuthorizationContextHolder.setAuthorizationHeader("Bearer " + userToken);

        if (isRecipientConnected && isRecipientActivelyChattingWithSender) {
            // Forward the message via WebSocket
            messagingTemplate.convertAndSendToUser(String.valueOf(recipientId), queueName, chatNotification);
        } else {
            // Send a push notification
            LOGGER.info("Trigger notification");

            CreateNotificationDTO notification = CreateNotificationDTO.builder()
                    .actorId(senderId)
                    .userIds(List.of(recipientId))
                    .universityIds(List.of(0))
                    .postId(null)
                    .commentId(null)
                    .message(newChatMessageDTO.getContent())
                    .notificationType("CHAT_MESSAGE")
                    .build();

            try {
                notificationRepository.createNotification(notification);
            } finally {
                AuthorizationContextHolder.clear(); // Avoid memory leaks
            }

        }

    }

    @PostMapping("/sharePost")
    public ResponseEntity<?> sharePost(@RequestBody NewChatMessageDTO newChatMessageDTO){
        return chatMessageService.sharePost(newChatMessageDTO);
    }

    @GetMapping("/messages/{senderId}/{recipientId}/{offset}/{pageSize}")
    public ResponseEntity<List<ChatNotification>> getAllChatMessagesBySenderReceiverId(@PathVariable Long senderId, @PathVariable Long recipientId, @PathVariable Integer offset, @PathVariable Integer pageSize){
        return ResponseEntity.ok(chatMessageService.findChatMessagesBySenderAndRecipientId(senderId, recipientId, offset, pageSize));
    }

    @GetMapping("/getAllChatsByUserId")
    public ResponseEntity<?> getAllChatsByUserId(@RequestParam Long userId){
        return chatMessageService.getAllChatsByUserId(userId);
    }

    @GetMapping("/getRecipientDetails")
    public ResponseEntity<?> getRecipientDetails(@RequestParam Long userId){
        return chatMessageService.getRecipientDetails(userId);
    }

    @PostMapping("/setActiveChat")
    public void setActiveChat(@RequestParam Long userId, @RequestParam Long activeChatUserId) {
        activeUserTracker.setActiveChat(userId, activeChatUserId);
    }

    @PostMapping("/clearActiveChat")
    public void clearActiveChat(@RequestParam Long userId) {
        activeUserTracker.clearActiveChat(userId);
    }

}
