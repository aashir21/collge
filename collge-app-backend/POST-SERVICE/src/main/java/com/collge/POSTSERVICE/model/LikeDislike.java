package com.collge.POSTSERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "likes_dislikes")
@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LikeDislike {

    @Id
    private String id; // Unique ID for the like/dislike record
    private String postId;
    private Long userId;
    private String type;

    public LikeDislike(String postId, Long userId, String type) {
        this.postId = postId;
        this.userId = userId;
        this.type = type;
    }

}
