package com.collge.NOTIFICATION_SERVICE.repository;

import com.collge.NOTIFICATION_SERVICE.dto.GetUserPostDataDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Repository
@FeignClient(
        name = "USER-SERVICE",
        url = "${service-urls.baseEndpoint}"
)
public interface UserRepository {

    @GetMapping({"/api/v1/user/getUserPostDataById"})
    GetUserPostDataDTO getUserPostDataById(@RequestParam Long userId);

    @GetMapping({"/api/v1/user/block/getBlockedUsersIds"})
    List<Long> getBlockedUsersIds(@RequestParam Long userId);

}
