package com.collge.USERSERVICE.DTO;

import com.collge.USERSERVICE.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class GetUserPostDataDTO {

    private long userId;
    private int universityId;
    private String firstName;
    private String lastName;
    private String username;
    private String avatar;
    private Role role;
    private Boolean isPremiumUser;

}
