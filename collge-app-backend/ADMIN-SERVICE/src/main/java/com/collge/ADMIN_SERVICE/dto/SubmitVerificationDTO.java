package com.collge.ADMIN_SERVICE.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SubmitVerificationDTO {

    private String email;
    private String verificationType;

}
