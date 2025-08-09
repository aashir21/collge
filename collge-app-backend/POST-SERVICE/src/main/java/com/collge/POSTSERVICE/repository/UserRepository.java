package com.collge.POSTSERVICE.repository;

import com.collge.POSTSERVICE.dto.GetUserPostDataDTO;
import com.collge.POSTSERVICE.dto.LinkUpProfileDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping({"/api/v1/user/updateReputation"})
    String updateReputation(@RequestParam Long userId, @RequestParam int updatedVote);

    @GetMapping({"/api/v1/user/getUserLinkUpDataByAuthorId"})
    LinkUpProfileDTO getUserLinkUpDataById(@RequestParam Long userId);

    @GetMapping({"/api/v1/user/getUserCampusByUserId"})
    String getUserCampusByUserId(@RequestParam Long userId);

    //userId refers to the person who's request is being accepted
    //authorId refers to the person who created the post
    //collaboratorId refers to the person who collabs on a linkup
    @PutMapping({"/api/v1/user/updateFire"})
    void updateFire(@RequestParam Long userId, @RequestParam Long authorId, @RequestParam(required = false) Long collaboratorId);

    @GetMapping({"/api/v1/user/block/getBlockedUsersIds"})
    List<Long> getBlockedUsersIds(@RequestParam Long userId);

}
