package com.collge.USERSERVICE.DTO;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TokenDTO {

    private String jwtToken;
    private String refreshToken;

}
