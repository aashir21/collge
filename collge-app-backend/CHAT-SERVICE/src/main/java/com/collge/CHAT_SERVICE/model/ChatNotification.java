package com.collge.CHAT_SERVICE.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChatNotification {

    private String chatId;
    private String messageId;
    private Long senderId;
    private Long recipientId;
    private String content;

    private String postId;
    private String username;
    private String caption;
    private String avatar;
    private String mediaThumbnailUrl;
    private Boolean isPostFound;
    private Boolean isTextOnly;
    private String role;
    private Boolean isPremiumUser;

    private String postType;

    @JsonProperty("createdAt")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") // Adjust pattern as needed
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    private LocalDateTime createdAt;

}
