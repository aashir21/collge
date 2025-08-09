package com.collge.CHAT_SERVICE.controller;

import com.collge.CHAT_SERVICE.DTO.UserConnectionRequestDTO;
import com.collge.CHAT_SERVICE.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/app")
@CrossOrigin("*")
public class AppChatController {

    @Autowired
    private UserRepository userRepository;

    @MessageMapping("/user.connectUser")
    @SendTo("/user/topic")
    public String connectUser(@Payload UserConnectionRequestDTO userConnectionRequestDTO){

        return userRepository.connectUser(userConnectionRequestDTO.getUserId());

    }

    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/topic")
    public String disconnectUser(@Payload UserConnectionRequestDTO userConnectionRequestDTO){

        return userRepository.disconnectUser(userConnectionRequestDTO.getUserId());

    }

}
