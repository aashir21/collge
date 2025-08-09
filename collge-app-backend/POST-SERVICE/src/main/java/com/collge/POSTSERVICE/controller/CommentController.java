package com.collge.POSTSERVICE.controller;


import com.collge.POSTSERVICE.dto.CreateCommentDTO;
import com.collge.POSTSERVICE.dto.CreateReplyDTO;
import com.collge.POSTSERVICE.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/addCommentToPost")
    public ResponseEntity<?> addCommentToPost(@RequestBody CreateCommentDTO createCommentDTO){
        return commentService.addCommentToPost(createCommentDTO);
    }

    @GetMapping("/getCommentsByPostId/{postId}/{offset}/{size}")
    public ResponseEntity<?> getCommentsByPostId(@PathVariable String postId,@PathVariable int offset, @PathVariable int size){
        return commentService.getCommentsByPostId(postId,offset, size);
    }

    @DeleteMapping("/deleteCommentById")
    public ResponseEntity<?> deleteCommentById(@RequestParam String commentId){
        return commentService.deleteCommentById(commentId);
    }

    @GetMapping("/getCommentsByUserId")
    public ResponseEntity<?> getCommentsByUserId(@RequestParam Long userId, @RequestParam int offset, @RequestParam int pageSize){

        return commentService.getCommentsByUserId(userId, offset, pageSize);

    }

}
