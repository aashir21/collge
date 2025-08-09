package org.collge.universityservice.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class EmailDTO {

    private String uniName;
    private String uniEmail;

}
