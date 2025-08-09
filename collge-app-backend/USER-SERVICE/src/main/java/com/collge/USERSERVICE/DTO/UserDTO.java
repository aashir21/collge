package com.collge.USERSERVICE.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class UserDTO {
    private Boolean isVerified;
    private Boolean isPremiumUser;
    private String registrationType;
    private Boolean isBanned;
    private Integer universityId;
}
