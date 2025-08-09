package com.collge.NOTIFICATION_SERVICE.service_v2;

import com.collge.NOTIFICATION_SERVICE.dto.GetUserPostDataDTO;
import com.collge.NOTIFICATION_SERVICE.dto.NotificationDataDTO;
import com.collge.NOTIFICATION_SERVICE.dto.UniNotificationDataDTO;
import com.collge.NOTIFICATION_SERVICE.model.Notification;
import com.collge.NOTIFICATION_SERVICE.repository.UserRepository;
import com.collge.NOTIFICATION_SERVICE.repository_v2.NotificationRepository_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class NotificationService_V2 {

    @Autowired
    private NotificationRepository_V2 notificationRepositoryV2;

    @Autowired
    private UserRepository userRepository;

    private static final List<String> UNI_TYPES_TO_EMIT = Arrays.asList("NEW_COMMENT", "NEW_REPLY", "FRIEND_REQUEST", "COMMENT_MENTION", "POST_MENTION", "REPLY_MENTION", "TAGGED", "STORY_MENTION", "PROFILE_VISIT", "WINK", "LINKUP_INTEREST", "LINKUP_ACCEPTED", "CHAT_MESSAGE", "POST_SHARE");

    public ResponseEntity<?> getAllNotificationsByUniversityId(Integer universityId, Integer offset, Integer pageSize, Long userId) {

        try{

            Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("createdAt").descending());

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            Page<Notification> notifications = notificationRepositoryV2.getNotificationByUniversityId(universityId,UNI_TYPES_TO_EMIT,blockedUsers,pageable);
            List<Notification> notificationList = notifications.getContent();

            List<UniNotificationDataDTO> notificationDTOs = convertUniNotificationDTO(notificationList);

            return new ResponseEntity<>(notificationDTOs, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Something went wrong: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    private List<UniNotificationDataDTO> convertUniNotificationDTO(List<Notification> notifications){

        List<UniNotificationDataDTO> commentDTOS = new ArrayList<>();

        notifications.forEach((notification) -> {
            GetUserPostDataDTO userDataDTO = userRepository.getUserPostDataById(notification.getActorId());
            GetUserPostDataDTO receiverDataDTO = userRepository.getUserPostDataById(notification.getUserId());

            UniNotificationDataDTO notificationDataDTO = UniNotificationDataDTO.builder()

                    .actorId(notification.getActorId())
                    .notificationId(notification.getNotificationId())
                    .userId(notification.getUserId())
                    .notificationType(notification.getNotificationType())
                    .role(userDataDTO.getRole())
                    .actorUsername(userDataDTO.getUsername())
                    .actorAvatar(userDataDTO.getAvatar())
                    .receiverAvatar(receiverDataDTO.getAvatar())
                    .receiverUsername(receiverDataDTO.getUsername())
                    .createdAt(notification.getCreatedAt())
                    .isPremiumUser(userDataDTO.getIsPremiumUser())

                    .build();

            commentDTOS.add(notificationDataDTO);

        });

        return commentDTOS;
    }

}
