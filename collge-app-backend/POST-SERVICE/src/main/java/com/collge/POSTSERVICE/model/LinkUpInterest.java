package com.collge.POSTSERVICE.model;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "linkup_interests")
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkUpInterest {

    @Id
    private String interestId;

    private Long authorId;
    private String postId;
    private Long userId;
    private LocalDateTime createdAt;

}
