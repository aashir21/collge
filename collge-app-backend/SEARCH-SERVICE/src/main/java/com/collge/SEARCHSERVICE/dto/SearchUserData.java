package com.collge.SEARCHSERVICE.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class SearchUserData {

    private Long userId;
    private String avatar;
    private String firstName;
    private String lastName;
    private String username;
    private Boolean premiumUser;
    private String role;

}
