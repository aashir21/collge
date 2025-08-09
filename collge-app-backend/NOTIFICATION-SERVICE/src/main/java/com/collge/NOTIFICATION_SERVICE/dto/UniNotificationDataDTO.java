package com.collge.NOTIFICATION_SERVICE.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UniNotificationDataDTO {

    private Long actorId;
    private String notificationId;
    private Long userId;
    private LocalDateTime createdAt;
    private String notificationType;
    private String actorUsername;
    private String receiverUsername;
    private String receiverAvatar;
    private String actorAvatar;
    private String role;
    private String isPremiumUser;

}
