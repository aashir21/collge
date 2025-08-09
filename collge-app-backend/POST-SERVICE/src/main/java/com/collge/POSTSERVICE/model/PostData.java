package com.collge.POSTSERVICE.model;



import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;


@Document(collection = "posts")
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostData {

    @Id
    private String postId;
    private Long userId;
    private LocalDateTime createdAt;
    private Integer votes;
    private String caption;
    private List<String> filePath;
    private String postType;
    private Boolean isEdited;
    private Integer universityId;
    private Integer views;
    private String mediaThumbnail;
    private Boolean isGlobal;

}
