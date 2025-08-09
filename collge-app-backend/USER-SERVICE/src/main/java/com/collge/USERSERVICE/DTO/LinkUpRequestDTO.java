package com.collge.USERSERVICE.DTO;


import lombok.*;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class LinkUpRequestDTO {

    private Long userId;
    private String firstName;
    private String lastName;
    private String avatar;
    private String role;
    private String username;
    private String bio;
    private Integer fire;
    private Integer reputation;

    private boolean isPremiumUser;
    private boolean isLinkUpVerified;

    private String uniName;
    private String campus;
    private int yearOfGraduation;
    private int postCount;
    private String title;
    private Boolean winkable;

    private List<String> images = new ArrayList<>();
    private List<String> interests = new ArrayList<>();

}
