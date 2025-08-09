package com.collge.ADMIN_SERVICE.dto;

import lombok.*;

import java.time.Instant;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateReportDTO {

    //User ID of the user who is creating a new report
    private Long actorId;

    //User ID of the user who is being reported or whose content is being reported
    private Long userId;

    //Post ID of the post being reported
    private String postId;

    //Comment ID of the post being reported
    private String commentId;

    private String reportType;
    private String reportReason;

}
