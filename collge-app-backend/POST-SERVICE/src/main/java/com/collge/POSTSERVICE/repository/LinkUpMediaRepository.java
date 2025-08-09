package com.collge.POSTSERVICE.repository;

import com.collge.POSTSERVICE.model.LinkUpInterest;
import com.collge.POSTSERVICE.model.LinkUpMedia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface LinkUpMediaRepository extends MongoRepository<LinkUpMedia, String> {

    @Query("{userId:  ?0}")
    List<LinkUpMedia> getAllByUserId(Long userId);

}
