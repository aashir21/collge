package com.collge.POSTSERVICE.controller_v2;

import com.collge.POSTSERVICE.service_v2.RepliesService_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/reply")
public class RepliesController_V2 {

    @Autowired
    RepliesService_V2 repliesServiceV2;

    @GetMapping("/getRepliesByPostId/{userId}/{postId}/{offset}/{size}")
    public ResponseEntity<?> getRepliesByPostId(@PathVariable Long userId, @PathVariable String postId, @PathVariable int offset, @PathVariable int size){
        return repliesServiceV2.getRepliesByPostId(userId,postId, offset, size);
    }

}
