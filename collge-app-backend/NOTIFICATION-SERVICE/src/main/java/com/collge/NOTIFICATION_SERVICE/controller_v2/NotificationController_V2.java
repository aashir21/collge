package com.collge.NOTIFICATION_SERVICE.controller_v2;

import com.collge.NOTIFICATION_SERVICE.service_v2.NotificationService_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/notification")
public class NotificationController_V2 {

    @Autowired
    private NotificationService_V2 notificationServiceV2;

    @GetMapping("/university")
    public ResponseEntity<?> getAllNotificationsByUniversityId(@RequestParam Integer universityId, @RequestParam Integer offset, Integer pageSize,@RequestParam Long userId){
        return notificationServiceV2.getAllNotificationsByUniversityId(universityId,offset,pageSize, userId);
    }

}
