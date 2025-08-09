package com.collge.NOTIFICATION_SERVICE.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class NotificationDataDTO {

    private Long actorId;
    private String notificationId;
    private Long userId;
    private Integer universityId;
    private String postId;
    private String commentId;
    private LocalDateTime createdAt;
    private String message;
    private String notificationType;
    private String username;
    private String avatar;
    private String role;
    private String isPremiumUser;

}
