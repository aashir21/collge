package com.collge.NOTIFICATION_SERVICE.service.pojos;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class NotificationScreenData {

    private String screenName;
    private String username;
    private String notificationType;
    private Long actorId = null;
    private Long recipientId = null;
    private String commentId = null;
    private String postId = null;

}
