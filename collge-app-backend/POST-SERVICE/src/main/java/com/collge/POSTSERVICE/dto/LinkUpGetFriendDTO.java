package com.collge.POSTSERVICE.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class LinkUpGetFriendDTO {

    private String friendFirstName;
    private String friendLastName;
    private String friendAvatar;
    private String friendUniName;

}
