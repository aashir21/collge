package com.collge.POSTSERVICE.repository;

import com.collge.POSTSERVICE.model.LinkUp;
import com.collge.POSTSERVICE.model.LinkUpInterest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface LinkUpRepository extends MongoRepository<LinkUp, String> {

    @Query("{userId :  ?0, status:  ?1}")
    Optional<LinkUp> findByUserIdAndStatus(Long userId, String status);

    @Query("{universityId: ?0, campus: ?1,status:  ?2, userId: {$nin: ?3} }")
    Page<LinkUp> findAllByUniversityIdAndStatus(Integer universityId, String campus, String status, List<Long> excludedUsers, Pageable page);

    @Query("{participantId: ?0}")
    Page<LinkUp> findAllByParticipantId(Long participantId,Pageable page);
    @Query("{userId: ?0}")
    Page<LinkUp> findAllByUserId(Long participantId,Pageable page);

    @Query("{campus: ?0,status:  ?1,universityId: {$nin: ?2},userId: {$nin: ?3}}")
    Page<LinkUp> findAllByCampusAndStatus(String campus, String status, List<Integer> universityId, List<Long> excludedUsers, Pageable page);

    @Query("{userId:  ?0}")
    Optional<LinkUp> findByUserId(Long authorId);



}
