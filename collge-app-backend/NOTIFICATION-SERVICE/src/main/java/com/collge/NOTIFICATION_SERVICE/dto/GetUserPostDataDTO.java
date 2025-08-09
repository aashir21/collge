package com.collge.NOTIFICATION_SERVICE.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class GetUserPostDataDTO {

    private String firstName;
    private String username;
    private String avatar;
    private String role;
    private String isPremiumUser;


}
