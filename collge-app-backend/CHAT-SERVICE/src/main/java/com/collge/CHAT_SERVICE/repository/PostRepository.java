package com.collge.CHAT_SERVICE.repository;

import com.collge.CHAT_SERVICE.DTO.ChatPostDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@Repository
@FeignClient(
        name = "POST-SERVICE",
        url = "${service-urls.baseEndpoint}"
)
public interface PostRepository {

    @GetMapping({"/api/v1/data/chat/getMediaThumbnail"})
    ChatPostDTO getMediaThumbnail(@RequestParam String postId);

}
