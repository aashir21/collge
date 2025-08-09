package com.collge.ADMIN_SERVICE.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "verifications")
public class Verification {

    @Id
    private String verificationId;

    private String email;
    private List<String> filePaths;
    private String status;
    private String verificationType;
    private LocalDateTime createdAt;
    private List<String> rejectionReasons;

}
