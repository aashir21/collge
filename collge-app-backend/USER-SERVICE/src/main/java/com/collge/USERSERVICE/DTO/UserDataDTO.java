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
public class UserDataDTO {

    private Long userId;
    private Integer universityId;
    private String firstName;
    private String username;
    private Integer reputation;
    private Integer fire;
    private String bio;
    private String title;
    private String universityName;
    private String avatar;
    private Boolean isPremiumUser;
    private Role role;
    private boolean isWinkable;
    private Integer numberOfPosts;

}
