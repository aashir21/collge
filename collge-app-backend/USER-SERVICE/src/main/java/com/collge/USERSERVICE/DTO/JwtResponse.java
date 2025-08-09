package com.collge.USERSERVICE.DTO;

import com.collge.USERSERVICE.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class JwtResponse {

    private Long userId;
    private Integer universityId;
    private String username;
    private String email;
    private String jwtToken;
    private String refreshToken;
    private String firstName;
    private String avatarUri;
    private Boolean isVerified;
    private Boolean isPremiumUser;
    private Role role;

}
