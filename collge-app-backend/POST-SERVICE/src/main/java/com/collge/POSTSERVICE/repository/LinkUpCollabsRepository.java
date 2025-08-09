package com.collge.POSTSERVICE.repository;

import com.collge.POSTSERVICE.model.LinkUpCollaboration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LinkUpCollabsRepository extends MongoRepository<LinkUpCollaboration, String> {
    @Query("{authorId :  ?0, friendId:  ?1, collabRequestStatus:  ?2}")
    Optional<LinkUpCollaboration> getUserAndFriendId(Long authorId, Long friendId, String collabRequestStatus);

}
