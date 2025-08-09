package com.collge.USERSERVICE.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FriendDataDTO {

    private Long friendId;
    private String firstName;
    private String lastName;
    private String username;
    private String avatar;
    private boolean isPremiumUser;
    private String role;

}
