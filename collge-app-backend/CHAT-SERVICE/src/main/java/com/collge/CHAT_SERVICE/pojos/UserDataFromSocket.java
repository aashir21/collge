package com.collge.CHAT_SERVICE.pojos;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class UserDataFromSocket {

    private Long userId;
    private Long recipientId;
    private String refreshToken;

}
