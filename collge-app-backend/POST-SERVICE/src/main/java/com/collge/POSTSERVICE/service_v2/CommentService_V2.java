package com.collge.POSTSERVICE.service_v2;

import com.collge.POSTSERVICE.dto.CommentDTO;
import com.collge.POSTSERVICE.dto.GetUserPostDataDTO;
import com.collge.POSTSERVICE.model.Comment;
import com.collge.POSTSERVICE.repository.PostRepository;
import com.collge.POSTSERVICE.repository.RepliesRepository;
import com.collge.POSTSERVICE.repository.UserRepository;
import com.collge.POSTSERVICE.repository_v2.CommentRepository_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CommentService_V2 {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository_V2 commentRepositoryV2;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    RepliesRepository repliesRepository;


    public ResponseEntity<?> getCommentsByPostId(Long userId, String postId, int offset, int size) {

        try{
            Pageable pageable = PageRequest.of(offset, size, Sort.by("createdAt").descending());

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            Page<Comment> comments = commentRepositoryV2.getCommentsByPostId(postId,blockedUsers,pageable);
            List<Comment> commentList = comments.getContent();

            List<CommentDTO> commentDTOS = convertCommentDTO(commentList);

            return new ResponseEntity<>(commentDTOS, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

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
