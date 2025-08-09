package com.collge.USERSERVICE.repository;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
@FeignClient(
        name = "POST-SERVICE",
        url = "${service-urls.baseEndpoint}"
)
public interface PostRepository {

    @GetMapping({"/api/v1/data/user/getPostCount"})
    Integer getNumberOfPostsByUserId(@RequestParam Long userId);

}
