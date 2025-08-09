package com.collge.USERSERVICE.repository;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
@FeignClient(
        name = "NOTIFICATION-SERVICE",
        url = "${service-urls.baseEndpoint}"
)
public interface NotificationRepository {

    @DeleteMapping({"/api/v1/notificationToken/deleteToken"})
    ResponseEntity<?> deleteToken(@RequestParam Long userId);

}
