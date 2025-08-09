package com.collge.USERSERVICE.repository;

import com.collge.USERSERVICE.DTO.UniDTO;
import com.collge.USERSERVICE.model.University;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;


@Repository
@FeignClient(
        name = "UNIVERSITY-SERVICE",
        url = "${service-urls.baseEndpoint}"
)
public interface UniversityRepository {

    @PostMapping({"/api/v1/university/checkUniEmail"})
    Boolean IfUniEmailValidOfUni(UniDTO uniDTO);

    @GetMapping({"/api/v1/university/getUniByName/{uniName}"})
    University getUniByName(@PathVariable String uniName);

    @GetMapping({"/api/v1/university/getUniById/{universityId}"})
    University getUniById(@PathVariable Integer universityId);

}
