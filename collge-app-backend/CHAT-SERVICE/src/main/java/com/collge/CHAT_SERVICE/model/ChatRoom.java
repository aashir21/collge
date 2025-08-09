package com.collge.CHAT_SERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Date;

@Document("chat-rooms")
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoom {

    @Id
    private String chatRoomId;

    private String chatId;
    private Long senderId;
    private Long recipientId;
    private LocalDateTime lastActivity;


}
