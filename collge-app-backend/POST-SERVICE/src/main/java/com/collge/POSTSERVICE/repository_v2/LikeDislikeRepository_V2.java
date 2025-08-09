package com.collge.POSTSERVICE.repository_v2;

import com.collge.POSTSERVICE.model.LikeDislike;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface LikeDislikeRepository_V2 extends MongoRepository<LikeDislike, String> {

    @Query("{postId: ?0, userId: {$nin:  ?1}}")
    List<LikeDislike> getAllVotesByPostId(String postId, List<Long> excludedUsers);

    @Query("{postId: ?0, type: ?1, userId: {$nin:  ?2}}")
    List<LikeDislike> getAllVotesByVoteType(String postId, String type, List<Long> excludedUsers);

}
