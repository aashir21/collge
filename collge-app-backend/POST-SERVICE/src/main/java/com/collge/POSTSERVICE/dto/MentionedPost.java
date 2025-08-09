package com.collge.POSTSERVICE.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class MentionedPost {

    private GetPostDTO getPostDTO;
    private CommentDTO commentDTO;

}
