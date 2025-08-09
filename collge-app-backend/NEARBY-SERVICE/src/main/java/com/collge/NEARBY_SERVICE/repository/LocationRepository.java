package com.collge.NEARBY_SERVICE.repository;

import com.collge.NEARBY_SERVICE.model.Nearby;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends MongoRepository<Nearby, String> {

    @Query("{userId :  ?0}")
    Optional<Nearby> getByUserId(Long userId);

    @Query(
            "{ " +
                    "  userId: { $nin: ?0 }, " +
                    "  isDiscoverable: ?1, " +
                    "  location: { " +
                    "    $near: { " +
                    "      $geometry: ?2, " +
                    "      $maxDistance: ?3 " +
                    "    } " +
                    "  } " +
                    "}"
    )
    Page<Nearby> findByLocationNear(
            List<Long> excludedUsers,       // ?0
            boolean isDiscoverable,         // ?1
            GeoJsonPoint location,          // ?2
            double maxDistance,             // ?3 (instead of `Distance`)
            Pageable page                   // ?4
    );

}
