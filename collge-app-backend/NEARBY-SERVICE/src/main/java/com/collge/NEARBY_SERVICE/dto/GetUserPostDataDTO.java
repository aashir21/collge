package com.collge.NEARBY_SERVICE.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

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
