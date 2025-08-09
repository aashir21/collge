package com.collge.POSTSERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "linkup_collaborations")
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkUpCollaboration {

    @Id
    private String collabId;

    private Long authorId;

    private Long friendId;

    private String collabRequestStatus;

}
