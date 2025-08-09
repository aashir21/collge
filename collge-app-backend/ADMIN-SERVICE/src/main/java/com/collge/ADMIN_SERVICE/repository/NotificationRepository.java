package com.collge.ADMIN_SERVICE.repository;

import com.collge.ADMIN_SERVICE.dto.CreateNotificationDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Repository
@FeignClient(
        name = "NOTIFICATION-SERVICE",
        url = "${service-urls.baseEndpoint}"
)
public interface NotificationRepository {

    @PostMapping({"/api/v1/notification"})
    ResponseEntity<?> createNotifications(@RequestBody CreateNotificationDTO createNotificationDTO);

}
