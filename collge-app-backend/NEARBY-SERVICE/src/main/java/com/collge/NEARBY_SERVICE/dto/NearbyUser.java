package com.collge.NEARBY_SERVICE.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class NearbyUser {

    private String nearbyEntryId;
    private long userId;
    private String uniName;
    private String firstName;
    private String lastName;
    private String username;
    private String avatar;
    private String role;
    private String isPremiumUser;
    private LocalDateTime lastTimeAtLocation;

}
