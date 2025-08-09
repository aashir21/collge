package com.collge.USERSERVICE.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateUsernameDTO {

    private Long userId;
    private String newUsername;
    private String newJwtToken;

}
