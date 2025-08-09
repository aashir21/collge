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
public class NewChatMessageDTO {

    private Long senderId;
    private Long recipientId;
    private String content;
    private String postId;

}
