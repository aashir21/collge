package com.collge.NOTIFICATION_SERVICE.service;

import com.collge.NOTIFICATION_SERVICE.dto.CreateNotificationDTO;
import com.collge.NOTIFICATION_SERVICE.dto.GetUserPostDataDTO;
import com.collge.NOTIFICATION_SERVICE.dto.NotificationDataDTO;
import com.collge.NOTIFICATION_SERVICE.dto.UniNotificationDataDTO;
import com.collge.NOTIFICATION_SERVICE.error.NotificationError;
import com.collge.NOTIFICATION_SERVICE.model.Notification;
import com.collge.NOTIFICATION_SERVICE.model.NotificationToken;
import com.collge.NOTIFICATION_SERVICE.repository.NotificationRepository;
import com.collge.NOTIFICATION_SERVICE.repository.NotificationTokenRepository;
import com.collge.NOTIFICATION_SERVICE.repository.UserRepository;
import com.collge.NOTIFICATION_SERVICE.service.pojos.NotificationData;
import com.collge.NOTIFICATION_SERVICE.service.pojos.SendNotification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.http.HttpRequest;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationTokenRepository notificationTokenRepository;

    @Autowired
    private SendNotification sendNotificationService;

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);

    private static final List<String> FOR_YOU_TYPES_TO_EMIT = Arrays.asList("APP_JOIN","NEW_LINK_UP", "CHAT_MESSAGE", "POST_SHARE");
    private static final List<String> UNI_TYPES_TO_EMIT = Arrays.asList("NEW_COMMENT", "NEW_REPLY", "FRIEND_REQUEST", "COMMENT_MENTION", "POST_MENTION", "REPLY_MENTION", "TAGGED", "STORY_MENTION", "PROFILE_VISIT", "WINK", "LINKUP_INTEREST", "LINKUP_ACCEPTED", "CHAT_MESSAGE", "POST_SHARE");

    public ResponseEntity<?> getAllNotificationsByUserId(Long userId, Integer offset, Integer pageSize) {

        try{

            Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("createdAt").descending());

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            LOGGER.info("Fetching user notifications from DB");
            Page<Notification> notifications = notificationRepository.getNotificationByUserId(userId,FOR_YOU_TYPES_TO_EMIT,blockedUsers,pageable);
            List<Notification> notificationList = notifications.getContent();

            List<NotificationDataDTO> notificationDTOs = convertNotificationDTO(notificationList);

            LOGGER.info("User notifications fetched and converted");
            return new ResponseEntity<>(notificationDTOs, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Something went wrong: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    public ResponseEntity<?> getNotificationsByTypeForUser(Long userId, String notificationType, Integer offset, Integer pageSize) {

        try{

            Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("createdAt").descending());

            LOGGER.info("Fetching university notifications from DB by type for a user");
            Page<Notification> notifications = notificationRepository.getNotificationByNotificationType(userId, notificationType,pageable);
            List<Notification> notificationList = notifications.getContent();

            List<NotificationDataDTO> notificationDTOs = convertNotificationDTO(notificationList);

            LOGGER.info("Notifications fetched and converted");
            return new ResponseEntity<>(notificationDTOs, HttpStatus.OK);

        }
        catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getAllNotificationsByUniversityId(Integer universityId, Integer offset, Integer pageSize) {

        try{

            Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("createdAt").descending());

            LOGGER.info("Fetching university notifications from DB");
            Page<Notification> notifications = notificationRepository.getNotificationByUniversityId(universityId,UNI_TYPES_TO_EMIT,pageable);
            List<Notification> notificationList = notifications.getContent();

            List<UniNotificationDataDTO> notificationDTOs = convertUniNotificationDTO(notificationList);

            LOGGER.info("University notifications fetched and converted");
            return new ResponseEntity<>(notificationDTOs, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>("Something went wrong: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    public String createNotifications(CreateNotificationDTO createNotificationDTO) {

        try {

            AtomicInteger currentIndex = new AtomicInteger();
            String notificationType = createNotificationDTO.getNotificationType();
            List<Long> userIds = createNotificationDTO.getUserIds();
            Long actorId = createNotificationDTO.getActorId();

            if(createNotificationDTO.getUserIds().isEmpty()){
                return NotificationError.CLG9095_MISSING_USER_ID.toString();
            }

            if(createNotificationDTO.getUniversityIds().isEmpty()){
                return NotificationError.CLG9095_MISSING_UNIVERSITY_ID.toString();
            }

            if(notificationType.equals("WINK") || notificationType.equals("PROFILE_VISIT") || notificationType.equals("NEARBY")){

                //We can hard code for first index, as wink and profile visit is always sent to one user at a time
                boolean isPresent = checkIfNotificationAlreadyExistsInADay(actorId, userIds.get(0), notificationType);

                if(isPresent){
                    return "Notifications updated!";
                }

            }

            userIds.forEach((id) -> {

                LOGGER.info("Extracting user ids and saving notifications");

                Long userId = notificationType.equals("APP_JOIN") ? createNotificationDTO.getActorId() : id;

                Notification newNotification = Notification
                        .builder()
                        .postId(createNotificationDTO.getPostId())
                        .actorId(createNotificationDTO.getActorId())
                        .userId(userId)
                        .commentId(createNotificationDTO.getCommentId())
                        .universityId(createNotificationDTO.getUniversityIds().get(currentIndex.get()))
                        .message(createNotificationDTO.getMessage())
                        .createdAt(LocalDateTime.now())
                        .notificationType(createNotificationDTO.getNotificationType())
                        .build();

                currentIndex.getAndIncrement();
                notificationRepository.save(newNotification);
            });

            LOGGER.info("Notifications saved and created successfully");

            if(notificationType.equals("APP_JOIN") || notificationType.equals("NEW_LINK_UP")){
                return "Notifications saved!";
            }

            LOGGER.info("Triggering push notification");

            extractTokensAndSendNotifications(createNotificationDTO);

            return "Notifications saved!";

        }
        catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    private List<NotificationDataDTO> convertNotificationDTO(List<Notification> notifications){

        List<NotificationDataDTO> commentDTOS = new ArrayList<>();

        notifications.forEach((notification) -> {
            GetUserPostDataDTO userDataDTO = userRepository.getUserPostDataById(notification.getActorId());

            NotificationDataDTO notificationDataDTO = NotificationDataDTO.builder()

                    .actorId(notification.getActorId())
                    .notificationId(notification.getNotificationId())
                    .userId(notification.getUserId())
                    .message(notification.getMessage())
                    .notificationType(notification.getNotificationType())
                    .postId(notification.getPostId())
                    .commentId(notification.getCommentId())
                    .role(userDataDTO.getRole())
                    .universityId(notification.getUniversityId())
                    .username(userDataDTO.getUsername())
                    .avatar(userDataDTO.getAvatar())
                    .createdAt(notification.getCreatedAt())
                    .isPremiumUser(userDataDTO.getIsPremiumUser())

                    .build();

            commentDTOS.add(notificationDataDTO);

        });

        return commentDTOS;
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

    private void extractTokensAndSendNotifications(CreateNotificationDTO createNotificationDTO){

        List<Long> userIds = createNotificationDTO.getUserIds();
        List<String> extractedTokens = new ArrayList<>();

        userIds.forEach((id) -> {

            Optional<NotificationToken> tokenOptional = notificationTokenRepository.getNotificationTokenByUserId(id);

            if(tokenOptional.isPresent()){

                NotificationToken token = tokenOptional.get();

                extractedTokens.add(token.getTokenValue());
            }
        });

        sendNotificationService.sendNotificationToUser(extractedTokens, createNotificationDTO);

    }

    private boolean checkIfNotificationAlreadyExistsInADay(Long actorId, Long userId, String notificationType) {

        boolean isPresent = false;

        // Fetch the latest notification for the user and type
        Optional<Notification> optionalNotification = notificationRepository
                .getLatestNotificationByType(userId, notificationType, actorId);

        if (optionalNotification.isPresent()) {

            Notification notification = optionalNotification.get();
            LocalDateTime nextValidTime = notification.getCreatedAt().plusHours(6L);

            if (LocalDateTime.now().isBefore(nextValidTime)) {
                LOGGER.info(notificationType + " found within the time frame for user: " + userId);

                if(actorId.equals(notification.getActorId())){
                    // Notification is within the time frame, update the timestamp to extend the time frame
                    notification.setCreatedAt(LocalDateTime.now());
                    notificationRepository.save(notification);

                    isPresent = true;
                }

            } else {

                //Delete the previous one, we dont need duplicates in the db
                notificationRepository.delete(notification);
                LOGGER.info("Time frame passed, new notification will be sent to user: " + userId);
            }
        }

        return isPresent;
    }

    public ResponseEntity<?> deleteNotificationByTypeAndUserId(Long senderId, Long receiverId, String notificationType){

        try{

            Optional<Notification> optionalNotification = notificationRepository.getNotificationByActorIdAndNotificationType(senderId, receiverId, notificationType);

            if(optionalNotification.isEmpty()){
                return new ResponseEntity<>("No notification present", HttpStatus.NOT_FOUND);
            }

            Notification notification = optionalNotification.get();
            notificationRepository.delete(notification);

            return new ResponseEntity<>("Notification deleted", HttpStatus.OK);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }
}
