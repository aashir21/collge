package com.collge.POSTSERVICE.repository;

import com.collge.POSTSERVICE.model.LinkUp;
import com.collge.POSTSERVICE.model.LinkUpInterest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LinkUpInterestRepository extends MongoRepository<LinkUpInterest, String> {

    @Query("{postId :  ?0, userId:  ?1}")
    Optional<LinkUpInterest> findByPostIdAndUserId(String postId, Long userId);

    @Query(value = "{ postId: ?0 }", delete = true)
    void deleteAllByPostId(String postId);

    @Query("{authorId:  ?0, userId: {$nin: ?1}}")
    Page<LinkUpInterest> getAllByAuthorId(Long authorId, List<Long> excludedUsers, Pageable pageable);
}
