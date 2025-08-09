package com.collge.USERSERVICE.DTO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PasswordDTO {

    private Long userId;
    private String newPassword;

}
