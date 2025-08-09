package com.collge.ADMIN_SERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "reports")
public class Report {

    @Id
    private String reportId;

    //User ID of the user who is creating a new report
    private Long actorId;

    //User ID of the user who is being reported
    private Long userId;

    //Post ID of the post being reported
    private String postId;

    //Comment ID of the post being reported
    private String commentId;

    private Instant createdAt;
    private String reportType;
    private String reportReason;

}
