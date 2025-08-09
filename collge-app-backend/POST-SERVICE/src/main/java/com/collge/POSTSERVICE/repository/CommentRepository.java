package com.collge.POSTSERVICE.repository;

import com.collge.POSTSERVICE.model.Comment;
import com.collge.POSTSERVICE.model.PostData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {

    @Query("{postId :  ?0}")
    public Page<Comment> getCommentsByPostId(String postId, Pageable page);

    @Query("{userId :  ?0}")
    public Page<Comment> getCommentsByUserId(Long userId, Pageable page);

}
