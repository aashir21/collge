package com.collge.POSTSERVICE.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class LinkUpDTO {

    private String postId;
    private Long authorId;
    private Long friendId;

    private String caption;
    private String date;
    private String time;
    private String location;
    private LocalDateTime createdAt;
    private String status;

    private boolean collaborativePost;
    private boolean locationHidden;

    private String collaborativeRequestStatus;

    private LinkUpGetAuthorDTO authorDTO;
    private LinkUpGetFriendDTO friendDTO;


}
