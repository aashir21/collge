package com.collge.POSTSERVICE.controller;

import com.collge.POSTSERVICE.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/data/user")
public class UserPostController {

    @Autowired
    private PostService postService;

    @GetMapping("/getPostCount")
    public int getPostCount(@RequestParam Long userId){
        return postService.getPostCount(userId);
    }

}
