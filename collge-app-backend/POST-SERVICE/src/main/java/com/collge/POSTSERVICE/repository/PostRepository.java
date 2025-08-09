package com.collge.POSTSERVICE.repository;

import com.collge.POSTSERVICE.model.PostData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface PostRepository extends MongoRepository<PostData, String> {

    @Query("{userId :  ?0}")
    public Page<PostData> getPostsByUserId(Long userId, Pageable page);

    @Query("{'universityId' :  ?0, 'userId' :  {$nin:  ?1}}")
    public Page<PostData> getPostsByUniversityId(Integer universityId,List<Long> excludedUsers, Pageable pageable);

    @Query("{isGlobal :  ?0, 'userId' :  {$nin:  ?1}}")
    public Page<PostData> getAllWhereIsGlobalTrue(Boolean isGlobal, List<Long> excludedUsers,Pageable pageable);

    @Query("{postType :  ?0, isGlobal:  ?1}")
    public Page<PostData> getPostsByType(String postType,Boolean isGlobal, Pageable page);

    @Query(value = "{ userId: ?0 }", count = true)
    int getNumberOfPostCount(Long userId);

}
