package com.collge.SEARCHSERVICE.controller;

import com.collge.SEARCHSERVICE.service.UserSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/search")
public class UserSearchController {

    @Autowired
    private UserSearchService userSearchService;

    @GetMapping("/getUsers")
    public ResponseEntity<?> getAllUsersWithQuery(@RequestParam String query, @RequestParam int offset, @RequestParam int pageSize) throws Exception{
        return userSearchService.getAllUsersWithQuery(query, offset,pageSize);
    }

}
