package com.collge.NOTIFICATION_SERVICE.service.pojos;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class NotificationData {

    private String title;
    private String body;
    private NotificationScreenData notificationScreenData;

}
