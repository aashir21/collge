package com.collge.POSTSERVICE.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "replies")
@Getter
@Setter
@Builder
public class Reply {

    @Id
    private String commentId;

    private String parentCommentId;
    private Long userId;
    private String postId;
    private String comment;
    private LocalDateTime createdAt;
    private Integer votes;

}
