package com.collge.NOTIFICATION_SERVICE.repository;

import com.collge.NOTIFICATION_SERVICE.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    @Query("{userId :  ?0, notificationType: {$nin: ?1}, 'actorId':  {$nin: ?2}}")
    public Page<Notification> getNotificationByUserId(Long userId, List<String> excludedTypes, List<Long> excludedUsers, Pageable page);

    @Query("{universityId :  ?0, notificationType: {$nin: ?1}}")
    public Page<Notification> getNotificationByUniversityId(Integer universityId,List<String> excludedTypes, Pageable page);

    @Query("{userId :  ?0, notificationType:  ?1}")
    public Page<Notification> getNotificationByNotificationType(Long userId, String notificationType , Pageable page);

    @Query(value = "{userId :  ?0, notificationType:  ?1, actorId: ?2}", sort = "{createdAt: -1}")
    public Optional<Notification> getLatestNotificationByType(Long userId, String notificationType, Long actorId);

    @Query("{actorId :  ?0, userId:  ?1,notificationType:  ?2}")
    public Optional<Notification> getNotificationByActorIdAndNotificationType(Long actorId, Long userId, String notificationType);
}
