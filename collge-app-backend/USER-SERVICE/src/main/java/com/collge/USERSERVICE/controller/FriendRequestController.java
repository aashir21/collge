package com.collge.USERSERVICE.controller;


import com.collge.USERSERVICE.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/friend")
public class FriendRequestController {

    @Autowired
    private FriendService friendService;

    @PostMapping("/send")
    public ResponseEntity<?> sendFriendRequest(@RequestParam Long senderId, @RequestParam Long receiverId) {

        return friendService.sendFriendRequest(senderId, receiverId);

    }

    @PostMapping("/respond")
    public ResponseEntity<?> respondToFriendRequest(@RequestParam Long senderId,@RequestParam Long receiverId, @RequestParam boolean accept) {

        return friendService.respondToFriendRequest(senderId, receiverId, accept);

    }

    @GetMapping("/getFriendRequestBySenderAndReceiverId")
    public ResponseEntity<?> getFriendRequestBySenderAndReceiverId(@RequestParam Long senderId, @RequestParam Long receiverId) {

        return friendService.getFriendRequestBySenderAndReceiverId(senderId, receiverId);

    }

    @DeleteMapping("/removeFriend")
    public ResponseEntity<?> removeFriend(@RequestParam Long senderId, @RequestParam Long receiverId){
        return friendService.removeFriend(senderId, receiverId);
    }

    @GetMapping("/getFriends")
    public ResponseEntity<?> getFriendsList(@RequestParam Long userId, @RequestParam int offset, @RequestParam int pageSize){
        return friendService.getFriendsList(userId,offset,pageSize);
    }

    @GetMapping("/getLinkUpVerifiedFriends")
    public ResponseEntity<?> getLinkUpVerifiedFriends(@RequestParam Long userId, @RequestParam int offset, @RequestParam int pageSize){
        return friendService.getLinkUpVerifiedFriends(userId,offset,pageSize);
    }

}
