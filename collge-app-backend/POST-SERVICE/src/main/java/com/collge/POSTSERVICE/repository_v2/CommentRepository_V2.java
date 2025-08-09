package com.collge.POSTSERVICE.repository_v2;

import com.collge.POSTSERVICE.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface CommentRepository_V2 extends MongoRepository<Comment, String> {

    @Query("{postId :  ?0, 'userId' : {$nin:  ?1}}")
    public Page<Comment> getCommentsByPostId(String postId, List<Long> excludedUsers, Pageable page);

}
