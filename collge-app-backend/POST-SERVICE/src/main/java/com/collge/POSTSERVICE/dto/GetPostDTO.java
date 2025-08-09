package com.collge.POSTSERVICE.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class GetPostDTO {

    private String postId;
    private String firstName;
    private Long userId;
    private Integer votes;
    private List<String> source;
    private LocalDateTime createdAt;
    private Boolean isEdited;
    private Integer views;
    private Integer universityId;
    private String caption;
    private String postType;
    private String username;
    private String avatar;
    private String role;
    private String isPremiumUser;
    private String likeStatus;

}
