package org.collge.universityservice.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AddValueDTO {

    private Integer universityId;
    private String value;

}
