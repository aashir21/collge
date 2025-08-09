package com.collge.POSTSERVICE.dto;


import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class GetUserPostDataDTO {

    private long userId;
    private int universityId;
    private String firstName;
    private String lastName;
    private String username;
    private String avatar;
    private String role;
    private String isPremiumUser;


}
