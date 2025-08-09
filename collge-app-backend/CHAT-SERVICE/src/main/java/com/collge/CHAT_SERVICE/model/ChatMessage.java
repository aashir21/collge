package com.collge.CHAT_SERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "chat-message")
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {

    @Id
    private String messageId;

    private String chatId;
    private Long senderId;
    private Long recipientId;
    private String content;
    private LocalDateTime createdAt;
    private String postId = null;

}
