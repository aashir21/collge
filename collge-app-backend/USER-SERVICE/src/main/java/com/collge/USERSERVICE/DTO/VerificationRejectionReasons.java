package com.collge.USERSERVICE.DTO;

import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VerificationRejectionReasons {

    private String email;
    private String reasonsString;

}
