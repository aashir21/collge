package com.collge.POSTSERVICE.repository_v2;

import com.collge.POSTSERVICE.model.Comment;
import com.collge.POSTSERVICE.model.Reply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepliesRepository_V2 extends MongoRepository<Reply, String> {

    @Query("{postId :  ?0, 'userId' :{$nin: ?1}}")
    public Page<Comment> getRepliesByPostId(String postId, List<Long> excludedUsers, Pageable page);

}
