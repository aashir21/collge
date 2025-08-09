package com.collge.NOTIFICATION_SERVICE.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class NotificationTokenDTO {

    private Long userId;
    private String tokenValue;
    private String permissionStatus;

}
