package com.collge.ADMIN_SERVICE.dto;


import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VerificationDTO {

    private String verificationId;
    private String email;
    private List<String> filePaths;
    private String status;
    private String verificationType;
    private LocalDateTime createdAt;

    private UserAccountVerificationData userData;

}
