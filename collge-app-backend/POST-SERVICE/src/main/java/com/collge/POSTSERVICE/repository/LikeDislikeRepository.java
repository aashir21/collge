package com.collge.POSTSERVICE.repository;

import com.collge.POSTSERVICE.model.LikeDislike;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface LikeDislikeRepository extends MongoRepository<LikeDislike, String> {

    @Query("{ postId: ?0, userId: ?1 }")
    Optional<LikeDislike> findByPostIdAndUserId(String postId, Long userId);

    @Query("{postId: ?0}")
    List<LikeDislike> getAllVotesByPostId(String postId);

    @Query("{postId: ?0, type: ?1}")
    List<LikeDislike> getAllVotesByVoteType(String postId, String type);

    //id here refers to the voteId;
    @Query(value = "{'postId': ?0}", count = true)
    int countVoteEntries(String postId);
}
