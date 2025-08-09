package com.collge.ADMIN_SERVICE.dto;

import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VerificationRejectionDTO {

    private String email;
    private List<String> rejectionReasons;

}
