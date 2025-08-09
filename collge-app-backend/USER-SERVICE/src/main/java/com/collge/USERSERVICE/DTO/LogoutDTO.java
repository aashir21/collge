package com.collge.USERSERVICE.DTO;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class LogoutDTO {

    private Long userId;
    private String jwtToken;
    private String refreshToken;

}
