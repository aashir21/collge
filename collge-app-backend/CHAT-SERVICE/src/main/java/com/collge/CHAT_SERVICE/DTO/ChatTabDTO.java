package com.collge.CHAT_SERVICE.DTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChatTabDTO {

    private Long userId;
    private String firstName = "";
    private String lastName = "";
    private String avatar = "";
    private String role = "";
    private boolean isPremiumUser = false;
    private String username = "";
    private LocalDateTime lastActivity;

}
