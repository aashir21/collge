package com.collge.NOTIFICATION_SERVICE.service;


import com.collge.NOTIFICATION_SERVICE.dto.NotificationTokenDTO;
import com.collge.NOTIFICATION_SERVICE.error.NotificationError;
import com.collge.NOTIFICATION_SERVICE.model.NotificationToken;
import com.collge.NOTIFICATION_SERVICE.repository.NotificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationTokenService {

    @Autowired
    private NotificationTokenRepository notificationTokenRepository;

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationService.class);

    public ResponseEntity<?> storeNotificationToken(NotificationTokenDTO notificationTokenDTO) {

        if(notificationTokenDTO.getUserId() == null){

            return new ResponseEntity<>(NotificationError.CLG9095_MISSING_NOTIF_TOKEN_USERID, HttpStatus.BAD_REQUEST);

        }

        Optional<NotificationToken> tokenOptional =  notificationTokenRepository.getNotificationTokenByUserId(notificationTokenDTO.getUserId());

        if(tokenOptional.isPresent()){

            NotificationToken notificationToken = tokenOptional.get();

            if(notificationToken.getTokenValue().equals(notificationTokenDTO.getTokenValue())){

                if(!notificationToken.getPermissionStatus().equals("granted")) {
                    notificationToken.setPermissionStatus(notificationTokenDTO.getPermissionStatus());
                    notificationTokenRepository.save(notificationToken);
                }
            }
            else {

                LOGGER.info("New notification token sent from frontend, updating..");
                notificationToken.setUserId(notificationToken.getUserId());
                notificationToken.setTokenValue(notificationTokenDTO.getTokenValue());
                notificationToken.setPermissionStatus(notificationTokenDTO.getPermissionStatus());
                notificationTokenRepository.save(notificationToken);
            }

            return new ResponseEntity<>(null, HttpStatus.OK);

        }
        LOGGER.info("No token found for this user, saving new token");

        NotificationToken newNotificationToken = NotificationToken.builder()
                .tokenValue(notificationTokenDTO.getTokenValue())
                .permissionStatus(notificationTokenDTO.getPermissionStatus())
                .userId(notificationTokenDTO.getUserId())
                .build();

        notificationTokenRepository.save(newNotificationToken);

        return new ResponseEntity<>(null, HttpStatus.OK);

    }

    public ResponseEntity<?> deleteToken(Long userId) {
        try{

            Optional<NotificationToken> optionalNotificationToken = notificationTokenRepository.getNotificationTokenByUserId(userId);

            if(optionalNotificationToken.isEmpty()){
                return new ResponseEntity<>("No notification token present", HttpStatus.NOT_FOUND);
            }

            NotificationToken notificationToken = optionalNotificationToken.get();
            notificationTokenRepository.delete(notificationToken);

            return new ResponseEntity<>("Notification deleted", HttpStatus.NO_CONTENT);

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }
}
