package com.collge.POSTSERVICE.model;



import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "comments")
@Getter
@Setter
@Builder
public class Comment {

    @Id
    private String commentId;

    private String postId;
    private Long userId;
    private String comment;
    private String parentCommentId;
    private LocalDateTime createdAt;
    private Integer votes;

}
