package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.DTO.BlockUserDTO;
import com.collge.USERSERVICE.service.BlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/block")
public class BlockController {

    @Autowired
    private BlockService blockService;

    @GetMapping("/getAllBlockedUsers")
    public ResponseEntity<?> getAllBlockedUsersWithData(@RequestParam Long userId, @RequestParam int offset, @RequestParam int pageSize){

        return blockService.getAllBlockedUsersWithData(userId, offset, pageSize);

    }

    @PostMapping
    public ResponseEntity<?> blockUser(@RequestBody BlockUserDTO blockUserDTO){
        return blockService.blockUser(blockUserDTO);
    }

    @GetMapping("/getBlockedUsersIds")
    public List<Long> getBlockedUsersIds(@RequestParam Long userId){
        return blockService.getAllBlockedUsersIds(userId);
    }

    @DeleteMapping("/{blockerId}/{blockedId}")
    public ResponseEntity<?> unblock(@PathVariable Long blockerId,@PathVariable Long blockedId){
        return blockService.unblock(blockerId, blockedId);
    }

}
