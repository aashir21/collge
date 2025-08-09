package com.collge.ADMIN_SERVICE.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserAccountVerificationData {

    private Long userId;
    private String firstName;
    private String lastName;
    private String uniName;
    private String campus;
    private Integer yearOfGraduation;

}
