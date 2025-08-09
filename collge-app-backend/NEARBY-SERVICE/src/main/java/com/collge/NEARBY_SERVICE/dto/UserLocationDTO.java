package com.collge.NEARBY_SERVICE.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserLocationDTO {

    private Long userId;
    private Double latitude;
    private Double longitude;

}
