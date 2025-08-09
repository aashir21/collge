package com.collge.POSTSERVICE.controller_v2;


import com.collge.POSTSERVICE.service_v2.PostService_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v2/post")
public class PostController_V2 {

    @Autowired
    private PostService_V2 postServiceV2;

    @GetMapping("/getAllVotesByPostId")
    public ResponseEntity<?> getAllVotesByPostId(@RequestParam Long userId,@RequestParam String postId){
        return postServiceV2.getAllVotesByPostId(userId,postId);
    }

    @GetMapping("/getAllVotesByVoteType")
    public ResponseEntity<?> getAllVotesByVoteType(@RequestParam Long userId,@RequestParam String postId, @RequestParam String type){
        return postServiceV2.getAllVotesByVoteType(userId,postId, type);
    }

}
