package com.collge.ADMIN_SERVICE.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class RequestDTO {

    private String verificationId;
    private String email;
    private String status;
    private String verificationType;
    private LocalDateTime createdAt;

}
