package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.DTO.ChatTabDTO;
import com.collge.USERSERVICE.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/chat")
public class UserChatController {

    @Autowired
    private UserService userService;

    @PutMapping("/connectUser")
    public String connectUser(@RequestParam Long userId){

        return userService.connectUser(userId);

    }

    @PutMapping("/disconnectUser")
    public String disconnectUser(@RequestParam Long userId){

        return userService.disconnectUser(userId);

    }

    @GetMapping("/getUserChatData")
    public ChatTabDTO getUserChatData(@RequestParam Long userId){
        return userService.getUserChatDetails(userId);
    }


}
