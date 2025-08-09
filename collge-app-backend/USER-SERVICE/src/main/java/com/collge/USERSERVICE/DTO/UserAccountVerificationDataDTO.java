package com.collge.USERSERVICE.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserAccountVerificationDataDTO {

    private String firstName;
    private String lastName;
    private String uniName;
    private String campus;
    private Integer yearOfGraduation;

}
