package com.collge.NOTIFICATION_SERVICE.repository;

import com.collge.NOTIFICATION_SERVICE.model.NotificationToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface NotificationTokenRepository extends MongoRepository<NotificationToken, String> {

    @Query("{userId :  ?0}")
    public Optional<NotificationToken> getNotificationTokenByUserId(Long userId);

}
