package com.collge.ADMIN_SERVICE.repository;

import com.collge.ADMIN_SERVICE.model.UserInterest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserInterestRepository extends MongoRepository<UserInterest, String> {

    @Query("{email :  ?0}")
    Optional<UserInterest> getUserInterestByEmail(String email);

    long count();
    Page<UserInterest> findAll(Pageable pageable);

}
