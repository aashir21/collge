package com.collge.CHAT_SERVICE.repository;

import com.collge.CHAT_SERVICE.model.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {

    @Query("{senderId :  ?0, recipientId:  ?1}")
    Optional<ChatRoom> findBySenderIdAndRecipientId(Long senderId, Long recipientId);

    @Query("{senderId :  ?0, recipientId: {$nin: ?1}}")
    List<ChatRoom> findAllBySenderId(Long senderId, List<Long> excludedUsers);

}
