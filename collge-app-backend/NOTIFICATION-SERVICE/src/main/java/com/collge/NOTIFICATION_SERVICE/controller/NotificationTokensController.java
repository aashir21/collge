package com.collge.NOTIFICATION_SERVICE.controller;

import com.collge.NOTIFICATION_SERVICE.dto.NotificationTokenDTO;
import com.collge.NOTIFICATION_SERVICE.service.NotificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notificationToken")
public class NotificationTokensController {

    @Autowired
    private NotificationTokenService notificationTokenService;

    @PostMapping("/storeToken")
    public ResponseEntity<?> storeNotificationToken(@RequestBody NotificationTokenDTO notificationTokenDTO){
        return notificationTokenService.storeNotificationToken(notificationTokenDTO);
    }

    @DeleteMapping("/deleteToken")
    public ResponseEntity<?> deleteToken(@RequestParam Long userId){
        return notificationTokenService.deleteToken(userId);
    }

}
