package com.collge.POSTSERVICE.service;

import com.collge.POSTSERVICE.dto.CommentDTO;
import com.collge.POSTSERVICE.dto.CreateCommentDTO;
import com.collge.POSTSERVICE.dto.GetUserPostDataDTO;
import com.collge.POSTSERVICE.model.Comment;
import com.collge.POSTSERVICE.model.PostData;
import com.collge.POSTSERVICE.repository.CommentRepository;
import com.collge.POSTSERVICE.repository.PostRepository;
import com.collge.POSTSERVICE.repository.RepliesRepository;
import com.collge.POSTSERVICE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    RepliesRepository repliesRepository;

    public ResponseEntity<?> addCommentToPost(CreateCommentDTO createCommentDTO) {

        try{
            Optional<PostData> postData = postRepository.findById(createCommentDTO.getPostId());

            if(postData.isPresent()){

                Comment newComment = Comment.builder()
                        .parentCommentId(null)
                        .votes(0)
                        .comment(createCommentDTO.getComment())
                        .createdAt(LocalDateTime.now())
                        .userId(createCommentDTO.getUserId())
                        .postId(createCommentDTO.getPostId())
                        .build();

                commentRepository.save(newComment);

                return new ResponseEntity<>(newComment, HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>("No post found with ID: " + createCommentDTO.getPostId(), HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getCommentById(String commentId){

        Optional<Comment> optionalComment = commentRepository.findById(commentId);

        if(optionalComment.isPresent()){

            Comment comment = optionalComment.get();
            CommentDTO commentDTO = convertCommentDTO(comment);

            return new ResponseEntity<>(commentDTO, HttpStatus.OK);

        }

        return new ResponseEntity<>("No comment found with ID: " + commentId, HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<?> getCommentsByPostId(String postId, Integer offset, Integer size) {

        try{
            Pageable pageable = PageRequest.of(offset, size, Sort.by("createdAt").descending());
            Page<Comment> comments = commentRepository.getCommentsByPostId(postId,pageable);
            List<Comment> commentList = comments.getContent();

            List<CommentDTO> commentDTOS = convertCommentDTO(commentList);

            return new ResponseEntity<>(commentDTOS, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> getCommentsByUserId(Long userId, int offset, int pageSize) {

        try{
            Pageable pageable = PageRequest.of(offset, pageSize, Sort.by("createdAt").descending());
            Page<Comment> comments = commentRepository.getCommentsByUserId(userId,pageable);
            List<Comment> commentList = comments.getContent();

            List<CommentDTO> commentDTOS = convertCommentDTO(commentList);

            return new ResponseEntity<>(commentDTOS, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    public ResponseEntity<?> deleteCommentById(String commentId){

        try{
            Optional<Comment> optionalComment = commentRepository.findById(commentId);

            if(optionalComment.isPresent()){
                Comment comment = optionalComment.get();

                repliesRepository.deleteByCommentId(commentId);
                commentRepository.deleteById(commentId);

                return new ResponseEntity<>(null, HttpStatus.NO_CONTENT);
            }
            else{
                return new ResponseEntity<>("No comment found with ID: " + commentId, HttpStatus.NOT_FOUND);
            }
        }catch (Exception e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

    protected List<CommentDTO> convertCommentDTO(Page<Comment> comments){

        List<CommentDTO> commentDTOS = new ArrayList<>();

        comments.forEach((comment) -> {
            GetUserPostDataDTO userDataDTO = userRepository.getUserPostDataById(comment.getUserId());
            int numberOfReplies = repliesRepository.countRepliesToComment(comment.getCommentId());

            CommentDTO commentDTO = CommentDTO.builder()
                    .commentId(comment.getCommentId())
                    .postId(comment.getPostId())
                    .authorId(comment.getUserId())
                    .role(userDataDTO.getRole())
                    .comment(comment.getComment())
                    .repliesCount(numberOfReplies)
                    .username(userDataDTO.getUsername())
                    .avatar(userDataDTO.getAvatar())
                    .parentCommentId(null)
                    .createdAt(comment.getCreatedAt())
                    .isPremiumUser(userDataDTO.getIsPremiumUser())
                    .votes(comment.getVotes())
                    .build();

            commentDTOS.add(commentDTO);

        });

        return commentDTOS;
    }

    protected List<CommentDTO> convertCommentDTO(List<Comment> comments){

        List<CommentDTO> commentDTOS = new ArrayList<>();

        comments.forEach((comment) -> {
            GetUserPostDataDTO userDataDTO = userRepository.getUserPostDataById(comment.getUserId());
            int numberOfReplies = repliesRepository.countRepliesToComment(comment.getCommentId());

            CommentDTO commentDTO = CommentDTO.builder()
                    .commentId(comment.getCommentId())
                    .postId(comment.getPostId())
                    .authorId(comment.getUserId())
                    .role(userDataDTO.getRole())
                    .comment(comment.getComment())
                    .username(userDataDTO.getUsername())
                    .repliesCount(numberOfReplies)
                    .avatar(userDataDTO.getAvatar())
                    .parentCommentId(comment.getParentCommentId())
                    .createdAt(comment.getCreatedAt())
                    .isPremiumUser(userDataDTO.getIsPremiumUser())
                    .votes(comment.getVotes())
                    .build();

            commentDTOS.add(commentDTO);

        });

        return commentDTOS;
    }

    protected CommentDTO convertCommentDTO(Comment comment){


        GetUserPostDataDTO userDataDTO = userRepository.getUserPostDataById(comment.getUserId());
        int numberOfReplies = repliesRepository.countRepliesToComment(comment.getCommentId());

            CommentDTO commentDTO = CommentDTO.builder()
                    .commentId(comment.getCommentId())
                    .postId(comment.getPostId())
                    .authorId(comment.getUserId())
                    .role(userDataDTO.getRole())
                    .comment(comment.getComment())
                    .username(userDataDTO.getUsername())
                    .repliesCount(numberOfReplies)
                    .avatar(userDataDTO.getAvatar())
                    .parentCommentId(null)
                    .createdAt(comment.getCreatedAt())
                    .isPremiumUser(userDataDTO.getIsPremiumUser())
                    .votes(comment.getVotes())
                    .build();


        return commentDTO;
    }
}
