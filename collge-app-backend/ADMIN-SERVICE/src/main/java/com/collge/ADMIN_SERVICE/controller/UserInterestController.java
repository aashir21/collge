package com.collge.ADMIN_SERVICE.controller;

import com.collge.ADMIN_SERVICE.dto.UserInterestDTO;
import com.collge.ADMIN_SERVICE.service.UserInterestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/userInterest")
@CrossOrigin("*")
public class UserInterestController {

    @Autowired
    private UserInterestService userInterestService;

    @PostMapping
    public ResponseEntity<?> createInterest(@RequestBody UserInterestDTO interestDTO){
        return userInterestService.createInterest(interestDTO);
    }

    @GetMapping
    public ResponseEntity<?> getAllUserInterests(@RequestParam int offset, @RequestParam int pageSize){

        return userInterestService.getAllUserInterests(offset,pageSize);

    }

    @GetMapping("/getAllUserInterestCount")
    public ResponseEntity<?> getAllUserInterestCount(){
        return userInterestService.getAllUserInterestCount();
    }

}
