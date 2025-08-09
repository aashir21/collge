package com.collge.POSTSERVICE.controller_v2;

import com.collge.POSTSERVICE.service_v2.CommentService_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v2/comment")
@RestController
public class CommentController_V2 {

    @Autowired
    private CommentService_V2 commentService_v2;

    @GetMapping("/getCommentsByPostId/{userId}/{postId}/{offset}/{size}")
    public ResponseEntity<?> getCommentsByPostId(@PathVariable Long userId, @PathVariable String postId, @PathVariable int offset, @PathVariable int size){
        return commentService_v2.getCommentsByPostId( userId,postId,offset, size);
    }

}
