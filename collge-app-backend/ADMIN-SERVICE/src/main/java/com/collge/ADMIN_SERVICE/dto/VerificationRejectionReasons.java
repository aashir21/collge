package com.collge.ADMIN_SERVICE.dto;

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
