package com.collge.POSTSERVICE.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class CreateReplyDTO {

    private String commentId;
    private String postId;
    private Long userId;
    private String reply;

}
