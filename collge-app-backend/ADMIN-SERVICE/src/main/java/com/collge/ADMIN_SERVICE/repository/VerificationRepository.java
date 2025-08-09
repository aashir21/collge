package com.collge.ADMIN_SERVICE.repository;

import com.collge.ADMIN_SERVICE.model.Verification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationRepository extends MongoRepository<Verification, String> {

    @Query("{email :  ?0}")
    public Optional<Verification> getVerificationByEmail(String email);

    @Query("{status: {$nin: ?0}}")
    public Page<Verification> getVerificationsWithoutApproved(List<String> excludeTypes, Pageable pageable);

}
