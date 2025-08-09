package com.collge.NOTIFICATION_SERVICE.service;

import com.collge.NOTIFICATION_SERVICE.dto.CreateNotificationDTO;
import com.collge.NOTIFICATION_SERVICE.dto.GetUserPostDataDTO;
import com.collge.NOTIFICATION_SERVICE.error.NotificationError;
import com.collge.NOTIFICATION_SERVICE.model.Notification;
import com.collge.NOTIFICATION_SERVICE.model.NotificationToken;
import com.collge.NOTIFICATION_SERVICE.repository.NotificationRepository;
import com.collge.NOTIFICATION_SERVICE.repository.NotificationTokenRepository;
import com.collge.NOTIFICATION_SERVICE.repository.UserRepository;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository mockNotificationRepository;
    @Mock
    private UserRepository mockUserRepository;

    @Mock
    private NotificationTokenRepository mockTokenRepository;

    @InjectMocks
    private NotificationService notificationServiceUnderTest;

    @Disabled
    void testGetAllNotificationsByUserId() {

        // Configure NotificationRepository.getNotificationByUserId(...).
        final Page<Notification> notifications = new PageImpl<>(List.of(Notification.builder()
                .notificationId("notificationId")
                .actorId(1L)
                .userId(0L)
                .universityId(0)
                .message("message")
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .notificationType("notificationType")
                .build()));
        when(mockNotificationRepository.getNotificationByUserId(eq(0L), any(List.class),List.of(),any(Pageable.class))).thenReturn(notifications);

        // Configure UserRepository.getUserPostDataById(...).
        final GetUserPostDataDTO getUserPostDataDTO = GetUserPostDataDTO.builder()
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(1L)).thenReturn(getUserPostDataDTO);

        // Run the test
        final ResponseEntity<?> result = notificationServiceUnderTest.getAllNotificationsByUserId(0L, 0, 10);

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
    }

    @Disabled
    void testGetAllNotificationsByUniversityId() {
        // Setup
        final ResponseEntity<?> expectedResult = new ResponseEntity<>(null, HttpStatusCode.valueOf(200));

        // Configure NotificationRepository.getNotificationByUniversityId(...).
        final Page<Notification> notifications = new PageImpl<>(List.of(Notification.builder()
                .notificationId("notificationId")
                .actorId(1L)
                .userId(0L)
                .universityId(0)
                .message("message")
                .createdAt(LocalDateTime.of(2020, 1, 1, 0, 0, 0))
                .notificationType("notificationType")
                .build()));
        when(mockNotificationRepository.getNotificationByUniversityId(eq(0), any(List.class),any(Pageable.class)))
                .thenReturn(notifications);

        // Configure UserRepository.getUserPostDataById(...).
        final GetUserPostDataDTO getUserPostDataDTO = GetUserPostDataDTO.builder()
                .username("username")
                .avatar("avatar")
                .role("role")
                .isPremiumUser("isPremiumUser")
                .build();
        when(mockUserRepository.getUserPostDataById(1L)).thenReturn(getUserPostDataDTO);

        // Run the test
        final ResponseEntity<?> result = notificationServiceUnderTest.getAllNotificationsByUniversityId(0, 0, 10);

        // Verify the results
        assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(result.getBody()).isNotNull();
    }

    @Disabled
    void testCreateNotificationsWithASingleUser() {
        // Setup
        final CreateNotificationDTO createNotificationDTO = CreateNotificationDTO.builder()
                .userIds(List.of(0L))
                .universityIds(List.of(1))
                .message("message")
                .notificationType("notificationType")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("Notifications saved!", HttpStatusCode.valueOf(200));

        // Run the test
        notificationServiceUnderTest.createNotifications(createNotificationDTO);

        // Verify the results
        verify(mockNotificationRepository).save(any(Notification.class));
        verify(mockNotificationRepository, times(1)).save(any(Notification.class));
    }

    @Disabled
    void testCreateNotificationsWithMultipleUsers() {
        // Setup
        final CreateNotificationDTO createNotificationDTO = CreateNotificationDTO.builder()
                .userIds(List.of(0L, 5L, 69L))
                .universityIds(List.of(1,1,1))
                .message("message")
                .notificationType("notificationType")
                .build();
        final ResponseEntity<?> expectedResult = new ResponseEntity<>("Notifications saved!", HttpStatusCode.valueOf(200));

        // Run the test

        // Verify the results
        verify(mockNotificationRepository, times(3)).save(any(Notification.class));
    }

    @Test
    void testCreateNotificationsReturnsBadRequestMissingUsers() {
        // Setup
        final CreateNotificationDTO createNotificationDTO = CreateNotificationDTO.builder()
                .userIds(List.of())
                .universityIds(List.of(1))
                .message("message")
                .notificationType("notificationType")
                .build();
        // Run the test

        // Verify the results
    }

    @Test
    void testCreateNotificationsReturnsBadRequestMissingUniversity() {
        // Setup
        final CreateNotificationDTO createNotificationDTO = CreateNotificationDTO.builder()
                .userIds(List.of(1L))
                .universityIds(List.of())
                .message("message")
                .notificationType("notificationType")
                .build();
        // Run the test

        // Verify the results
    }
}
