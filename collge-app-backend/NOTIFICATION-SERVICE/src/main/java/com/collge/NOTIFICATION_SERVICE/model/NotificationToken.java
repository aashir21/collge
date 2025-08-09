package com.collge.NOTIFICATION_SERVICE.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notification-tokens")
@Getter
@Setter
@Builder
public class NotificationToken {

    @Id
    private String tokenId;

    private Long userId;
    private String tokenValue;
    private String permissionStatus;

}
