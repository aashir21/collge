package com.collge.POSTSERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "linkup_photos")
@Getter
@Builder
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LinkUpMedia {

    @Id
    private String mediaId;

    private Long userId;
    private String mediaUrl;

}
