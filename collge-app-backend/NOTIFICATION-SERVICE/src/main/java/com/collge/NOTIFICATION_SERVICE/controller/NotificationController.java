package com.collge.NOTIFICATION_SERVICE.controller;

import com.collge.NOTIFICATION_SERVICE.dto.CreateNotificationDTO;
import com.collge.NOTIFICATION_SERVICE.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user")
    public ResponseEntity<?> getAllNotificationsByUserId(@RequestParam Long userId, @RequestParam Integer offset, Integer pageSize){
        return notificationService.getAllNotificationsByUserId(userId,offset,pageSize);
    }

    @GetMapping("/university")
    public ResponseEntity<?> getAllNotificationsByUniversityId(@RequestParam Integer universityId, @RequestParam Integer offset, Integer pageSize){
        return notificationService.getAllNotificationsByUniversityId(universityId,offset,pageSize);
    }

    @GetMapping("/getNotificationsByTypeForUser")
    public ResponseEntity<?> getNotificationsByTypeForUser(@RequestParam Long userId, @RequestParam String notificationType, @RequestParam Integer offset, @RequestParam Integer pageSize){

        return notificationService.getNotificationsByTypeForUser(userId, notificationType, offset, pageSize);
    }

    @PostMapping
    public String createNotifications(@RequestBody CreateNotificationDTO createNotificationDTO){
        return notificationService.createNotifications(createNotificationDTO);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteNotificationByTypeAndUserId(@RequestParam Long senderId, Long receiverId, String notificationType){
        return notificationService.deleteNotificationByTypeAndUserId(senderId, receiverId, notificationType);
    }

}
