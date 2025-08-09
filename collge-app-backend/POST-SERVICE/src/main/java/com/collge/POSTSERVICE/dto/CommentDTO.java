package com.collge.POSTSERVICE.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CommentDTO {

    private String commentId;
    private String postId;
    private Long authorId;
    private String comment;
    private Integer votes;
    private String parentCommentId;
    private LocalDateTime createdAt;

    private String avatar;
    private String username;
    private String role;
    private String isPremiumUser;
    private Integer repliesCount;
}
