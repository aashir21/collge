package com.collge.POSTSERVICE.controller;

import com.collge.POSTSERVICE.dto.ChatPostDTO;
import com.collge.POSTSERVICE.dto.PostDTO;
import com.collge.POSTSERVICE.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/post")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping("/newPost")
    public ResponseEntity<?> addPost(@RequestParam String postDataRequest, @RequestParam(required = false) MultipartFile[] file){

        return postService.addPost(postDataRequest,file);

    }

    @GetMapping("/getPostById")
    public ResponseEntity<?> getPostById(@RequestParam Long userId, @RequestParam String postId){
        return postService.getPostById(userId, postId);
    }

    @GetMapping("/getPostsByUserId/{userId}")
    public ResponseEntity<?> getPostsByUserId(@PathVariable Long userId, @RequestParam Integer offset, @RequestParam Integer pageSize, @RequestParam Long requestorId){
        return postService.getPostsByUserId(userId, offset, pageSize, requestorId);
    }

    @DeleteMapping("/deletePostById")
    public ResponseEntity<?> deletePostById(@RequestParam String postId){
        return postService.deletePostById(postId);
    }

    @PutMapping("/updatePostById")
    public ResponseEntity<?> updatePostById(@RequestBody PostDTO postDTO){
        return postService.updatePostById(postDTO);
    }

    @GetMapping("/getPostsByType")
    public ResponseEntity<?> getPostsByType(@RequestParam Long userId, @RequestParam String type, @RequestParam Integer offset, @RequestParam Integer pageSize){
        return postService.getPostsByType(userId, type, offset, pageSize);
    }

    @PutMapping("/vote")
    public ResponseEntity<?> vote(@RequestParam long userId, @RequestParam String postId, @RequestParam String type){
        return postService.vote(userId, postId, type);
    }

    @GetMapping("/getAllVotesByPostId")
    public ResponseEntity<?> getAllVotesByPostId(@RequestParam String postId){
        return postService.getAllVotesByPostId(postId);
    }

    @GetMapping("/getAllVotesByVoteType")
    public ResponseEntity<?> getAllVotesByVoteType(@RequestParam String postId, @RequestParam String type){
        return postService.getAllVotesByVoteType(postId, type);
    }

    @GetMapping("/getMediaThumbnail")
    public ChatPostDTO getMediaThumbnail(@RequestParam String postId){
        return postService.getMediaThumbnail(postId);
    }

    @GetMapping("/getMentionedPostById")
    public ResponseEntity<?> getMentionedPostById(@RequestParam Long userId, @RequestParam String postId, @RequestParam(required = false) String commentId ,@RequestParam String type){
        return postService.getMentionedPostById(userId, postId, commentId, type);
    }
}
