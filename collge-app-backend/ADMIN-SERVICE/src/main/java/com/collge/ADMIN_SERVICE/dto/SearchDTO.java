package com.collge.ADMIN_SERVICE.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SearchDTO {

    private Long userId;
    private Integer universityId;
    private String email;
    private String username;

}
