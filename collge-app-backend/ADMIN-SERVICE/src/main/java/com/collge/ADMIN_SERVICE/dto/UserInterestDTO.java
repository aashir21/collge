package com.collge.ADMIN_SERVICE.dto;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserInterestDTO {

    private String fullName;
    private String gender;
    private String email;
    private String universityName;


}
