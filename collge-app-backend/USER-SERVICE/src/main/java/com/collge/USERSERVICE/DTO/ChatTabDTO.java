package com.collge.USERSERVICE.DTO;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ChatTabDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String avatar;
    private boolean isPremiumUser;
    private String username;
    private String role;

}
