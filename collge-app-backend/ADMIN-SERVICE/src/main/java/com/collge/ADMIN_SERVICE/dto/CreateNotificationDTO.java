package com.collge.ADMIN_SERVICE.dto;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CreateNotificationDTO {

    private Long actorId; //The person who generates the notification
    private List<Long> userIds; //The persons who receive the notification
    private List<Integer> universityIds;  //The university id of the persons who received the notification
    private String postId;
    private String commentId;
    private String message;
    private String notificationType;
}
