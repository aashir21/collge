package com.collge.CHAT_SERVICE.repository;

import com.collge.CHAT_SERVICE.DTO.CreateNotificationDTO;
import com.collge.CHAT_SERVICE.config.WebSocketFeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@Repository
@FeignClient(
        name = "NOTIFICATION-SERVICE",
        url = "${service-urls.baseEndpoint}",
        configuration = WebSocketFeignConfig.class
)
public interface NotificationRepository {

    @PostMapping(value = {"/api/v1/notification"})
    String createNotification(@RequestBody CreateNotificationDTO createNotificationDTO);

}
