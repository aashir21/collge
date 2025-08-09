package com.collge.NEARBY_SERVICE.repository;

import com.collge.NEARBY_SERVICE.model.University;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Repository
@FeignClient(
        name = "UNIVERSITY-SERVICE",
        url = "${service-urls.baseEndpoint}"
)
public interface UniversityRepository {

    @GetMapping({"/api/v1/university/getUniById/{universityId}"})
    University getUniById(@PathVariable Integer universityId);

}
