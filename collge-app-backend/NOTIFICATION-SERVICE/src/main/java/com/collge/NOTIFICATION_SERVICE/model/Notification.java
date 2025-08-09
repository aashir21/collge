package com.collge.NOTIFICATION_SERVICE.model;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Getter
@Setter
@Builder
public class Notification {

    @Id
    private String notificationId;

    private Long actorId;
    private Long userId;
    private Integer universityId;
    private String postId;
    private String commentId;
    private String message;
    private LocalDateTime createdAt;
    private String notificationType;

}
