package com.collge.POSTSERVICE.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class LinkUpGetAuthorDTO {

    private String authorFirstName;
    private String authorLastName;
    private String authorAvatar;
    private String authorUniName;

}
