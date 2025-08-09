package com.collge.NOTIFICATION_SERVICE.repository_v2;

import com.collge.NOTIFICATION_SERVICE.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Repository
public interface NotificationRepository_V2 extends MongoRepository<Notification, String> {

    @Query("{universityId :  ?0, notificationType: {$nin: ?1}, 'actorId':  {$nin: ?2}}")
    public Page<Notification> getNotificationByUniversityId(Integer universityId, List<String> excludedTypes, List<Long> excludedUsers,Pageable page);

}
