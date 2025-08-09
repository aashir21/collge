package com.collge.POSTSERVICE.repository;

import com.collge.POSTSERVICE.model.Comment;
import com.collge.POSTSERVICE.model.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RepliesRepository extends MongoRepository<Reply, String> {

    @Query("{parentCommentId :  ?0}")
    public Page<Comment> getRepliesByCommentId(String parentCommentId, Pageable page);

    @Query("{postId :  ?0}")
    public Page<Comment> getRepliesByPostId(String postId, Pageable page);

    @Query(value = "{ parentCommentId: ?0 }", count = true)
    int countRepliesToComment(String commentId);

    @Query(value = "{ 'parentCommentId' : ?0 }", delete = true)
    void deleteByCommentId(String commentId);

}
