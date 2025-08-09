package com.collge.POSTSERVICE.service;

import com.collge.POSTSERVICE.dto.CommentDTO;
import com.collge.POSTSERVICE.dto.CreateReplyDTO;
import com.collge.POSTSERVICE.dto.GetUserPostDataDTO;
import com.collge.POSTSERVICE.model.Comment;
import com.collge.POSTSERVICE.model.Reply;
import com.collge.POSTSERVICE.repository.CommentRepository;
import com.collge.POSTSERVICE.repository.RepliesRepository;
import com.collge.POSTSERVICE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RepliesService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private RepliesRepository repliesRepository;

    @Autowired
    private CommentService commentService;

    public ResponseEntity<?> addReplyToPost(CreateReplyDTO createReplyDTO) {

        try{
            Optional<Comment> createCommentDTO = commentRepository.findById(createReplyDTO.getCommentId());

            if(createCommentDTO.isPresent()){

                Reply reply = Reply.builder()
                        .postId(createReplyDTO.getPostId())
                        .parentCommentId(createReplyDTO.getCommentId())
                        .votes(0)
                        .comment(createReplyDTO.getReply())
                        .createdAt(LocalDateTime.now())
                        .userId(createReplyDTO.getUserId())
                        .build();

                repliesRepository.save(reply);

                return new ResponseEntity<>(reply, HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>("No comment found with ID: " + createReplyDTO.getCommentId(), HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }
    }

    public ResponseEntity<?> getRepliesByCommentId(String parentCommentId, Integer offset, Integer size) {


        try{
            Pageable pageable = PageRequest.of(offset, size, Sort.by("createdAt").ascending());
            Page<Comment> comments = repliesRepository.getRepliesByCommentId(parentCommentId,pageable);
            List<Comment> commentList = comments.getContent();

            List<CommentDTO> commentDTOS = commentService.convertCommentDTO(commentList);

            return new ResponseEntity<>(commentDTOS, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getRepliesByPostId(String postId, Integer offset, Integer size) {


        try{
            Pageable pageable = PageRequest.of(offset, size, Sort.by("createdAt").ascending());
            Page<Comment> comments = repliesRepository.getRepliesByPostId(postId,pageable);
            List<Comment> commentList = comments.getContent();

            List<CommentDTO> commentDTOS = commentService.convertCommentDTO(commentList);

            return new ResponseEntity<>(commentDTOS, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getRepliesCount (String parentCommentId){

        try{

            return new ResponseEntity<>(repliesRepository.countRepliesToComment(parentCommentId), HttpStatusCode.valueOf(200));

        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> deleteReplyById(String replyId){

        try{
            Optional<Reply> replyOptional = repliesRepository.findById(replyId);

            if(replyOptional.isPresent()){

                Reply reply = replyOptional.get();
                repliesRepository.deleteById(replyId);

                return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);

            }
            else{
                return new ResponseEntity<>("No reply found with ID: " + replyId, HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

//    public ResponseEntity<?> getAllRepliesByCommentId(String commentId) {
//
//        try{
//
//            List<Reply> replies = repliesRepository.f(commentId);
//
//
//        }catch (Exception e){
//            throw new RuntimeException("Something went wrong: " + e.getMessage());
//        }
//
//    }
}
