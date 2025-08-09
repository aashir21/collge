package com.collge.USERSERVICE.DTO;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class BlockUserDTO {

    private Long blockerId;
    private Long blockedId;

}
