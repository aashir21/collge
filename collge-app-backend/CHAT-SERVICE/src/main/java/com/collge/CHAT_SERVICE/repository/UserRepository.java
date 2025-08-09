package com.collge.CHAT_SERVICE.repository;

import com.collge.CHAT_SERVICE.DTO.ChatTabDTO;
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

    @PutMapping({"/api/v1/user/chat/connectUser"})
    String connectUser(@RequestParam Long userId);

    @PutMapping({"/api/v1/user/chat/disconnectUser"})
    String disconnectUser(@RequestParam Long userId);

    @GetMapping({"/api/v1/user/chat/getUserChatData"})
    ChatTabDTO getUserChatData(@RequestParam Long userId);

    @GetMapping({"/api/v1/user/block/getBlockedUsersIds"})
    List<Long> getBlockedUsersIds(@RequestParam Long userId);

}
