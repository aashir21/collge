package com.collge.USERSERVICE.DTO;

import com.collge.USERSERVICE.enums.FriendshipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class FriendStatusDTO {

    private Long userId;
    private Long friendId;
    private String requestStatus;

}
