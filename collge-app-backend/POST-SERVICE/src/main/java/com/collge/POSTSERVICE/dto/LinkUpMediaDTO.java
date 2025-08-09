package com.collge.POSTSERVICE.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class LinkUpMediaDTO {

    private Long userId;
    private String mediaUrl;

}
