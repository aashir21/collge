package com.collge.POSTSERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "linkups")
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkUp {

    @Id
    private String postId;
    private Long userId;
    private Long friendId;
    private Long participantId;
    private Integer universityId;

    private String caption;
    private String date;
    private String time;
    private String location;
    private String status;
    private String campus;
    private LocalDateTime createdAt;

    private boolean collaborativePost;
    private boolean locationHidden;


}
