package com.collge.POSTSERVICE.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CreateCommentDTO {

    private String postId;
    private Long userId;
    private String comment;


}
