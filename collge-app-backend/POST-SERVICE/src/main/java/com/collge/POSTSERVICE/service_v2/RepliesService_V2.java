package com.collge.POSTSERVICE.service_v2;

import com.collge.POSTSERVICE.dto.CommentDTO;
import com.collge.POSTSERVICE.model.Comment;
import com.collge.POSTSERVICE.repository.UserRepository;
import com.collge.POSTSERVICE.repository_v2.RepliesRepository_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RepliesService_V2 {

    @Autowired
    private CommentService_V2 commentService_v2;

    @Autowired
    private RepliesRepository_V2 repliesRepositoryV2;

    @Autowired
    private UserRepository userRepository;


    public ResponseEntity<?> getRepliesByPostId(Long userId, String postId, Integer offset, Integer size) {

        try{
            Pageable pageable = PageRequest.of(offset, size, Sort.by("createdAt").ascending());

            List<Long> blockedUsers = userRepository.getBlockedUsersIds(userId);

            Page<Comment> comments = repliesRepositoryV2.getRepliesByPostId(postId,blockedUsers,pageable);
            List<Comment> commentList = comments.getContent();

            List<CommentDTO> commentDTOS = commentService_v2.convertCommentDTO(commentList);

            return new ResponseEntity<>(commentDTOS, HttpStatus.OK);
        }catch (RuntimeException e){
            throw new RuntimeException("Something went wrong: " + e.getMessage());
        }

    }

}
