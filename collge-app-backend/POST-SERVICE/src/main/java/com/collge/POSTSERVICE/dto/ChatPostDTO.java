package com.collge.POSTSERVICE.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ChatPostDTO {

    private String mediaThumbnailUrl;
    private Boolean isPostFound;
    private Boolean isTextOnly;
    private String postType;
    private String caption;
    private Long userId;

}
