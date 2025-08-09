package com.collge.POSTSERVICE.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class GetVoteDTO {

    private String voteId;
    private long userId;
    private String firstName;
    private String lastName;
    private String username;
    private String avatar;
    private String role;
    private String isPremiumUser;
    private String type;

}
