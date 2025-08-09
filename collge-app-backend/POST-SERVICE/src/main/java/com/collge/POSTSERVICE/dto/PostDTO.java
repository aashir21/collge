package com.collge.POSTSERVICE.dto;

import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class PostDTO {

    private String postId;
    private Long userId;
    private Integer universityId;
    private String caption;
    private String postType;
    private String mediaThumbnailUrl = "";
    private Boolean isGlobal;

}
