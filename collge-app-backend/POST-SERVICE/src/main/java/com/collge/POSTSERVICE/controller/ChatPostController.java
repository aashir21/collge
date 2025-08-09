package com.collge.POSTSERVICE.controller;

import com.collge.POSTSERVICE.dto.ChatPostDTO;
import com.collge.POSTSERVICE.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/data/chat")
public class ChatPostController {

    @Autowired
    private PostService postService;

    @GetMapping("/getMediaThumbnail")
    public ChatPostDTO getMediaThumbnail(@RequestParam String postId){
        return postService.getMediaThumbnail(postId);
    }

}
