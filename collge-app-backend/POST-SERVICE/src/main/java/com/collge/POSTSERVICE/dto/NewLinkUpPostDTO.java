package com.collge.POSTSERVICE.dto;


import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class NewLinkUpPostDTO {

    private Long userId;
    private Long friendId;
    private Integer universityId;

    private String caption;
    private String date;
    private String time;
    private String location;
    private String campus;

    private boolean collaborativePost;
    private boolean locationHidden;

}
