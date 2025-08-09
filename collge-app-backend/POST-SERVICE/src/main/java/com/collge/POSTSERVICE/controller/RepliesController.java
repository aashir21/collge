package com.collge.POSTSERVICE.controller;

import com.collge.POSTSERVICE.dto.CreateReplyDTO;
import com.collge.POSTSERVICE.service.RepliesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reply")
public class RepliesController {

    @Autowired
    private RepliesService repliesService;

    @PostMapping("/addReplyToComment")
    public ResponseEntity<?> addReplyToPost(@RequestBody CreateReplyDTO createReplyDTO){
        return repliesService.addReplyToPost(createReplyDTO);
    }

    @GetMapping("/getRepliesByCommentId/{parentCommentId}/{offset}/{size}")
    public ResponseEntity<?> getRepliesByCommentId(@PathVariable String parentCommentId,@PathVariable int offset, @PathVariable int size){
        return repliesService.getRepliesByCommentId(parentCommentId, offset, size);
    }

    @GetMapping("/getRepliesByPostId/{postId}/{offset}/{size}")
    public ResponseEntity<?> getRepliesByPostId(@PathVariable String postId,@PathVariable int offset, @PathVariable int size){
        return repliesService.getRepliesByPostId(postId, offset, size);
    }

//    @GetMapping("/getAllRepliesByCommentId")
//    public ResponseEntity<?> getAllRepliesByCommentId(@RequestParam String commentId){
//        return repliesService.getAllRepliesByCommentId(commentId);
//    }

    @GetMapping("/getRepliesCount/{parentCommentId}")
    public ResponseEntity<?> getRepliesCount(@PathVariable String parentCommentId){
        return repliesService.getRepliesCount(parentCommentId);
    }

    @DeleteMapping("/deleteReplyById")
    public ResponseEntity<?> deleteReplyById(@RequestParam String replyId){
        return repliesService.deleteReplyById(replyId);
    }

}
