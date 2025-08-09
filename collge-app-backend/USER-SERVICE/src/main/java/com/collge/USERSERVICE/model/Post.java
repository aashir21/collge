package com.collge.USERSERVICE.model;

import java.time.LocalDateTime;
import java.util.List;

public class Post {

    private String postId;
    private Long userId;
    private LocalDateTime createdAt;
    private Integer votes;
    private List<String> comments;
    private String postType;

}
