package com.collge.POSTSERVICE.controller;

import com.collge.POSTSERVICE.model.PostData;
import com.collge.POSTSERVICE.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/home")
public class HomeController {

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<?> getAllPosts(){
        return postService.getAllPosts();
    }

    @GetMapping("/postByUniversity")
    public ResponseEntity<?> getAllPostsByUniversityId(@RequestParam Long userId, @RequestParam Integer universityId, @RequestParam Integer offset, @RequestParam Integer pageSize){
        return postService.getAllPostsByUniId(userId, universityId, offset, pageSize);
    }

    @GetMapping("/{userId}/{offset}/{size}")
    public ResponseEntity<?> getPostsForHome(@PathVariable Long userId,@PathVariable Integer offset, @PathVariable Integer size){
        return postService.getPostsForHome(userId, offset, size);
    }

}
