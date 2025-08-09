package com.collge.SEARCHSERVICE.controller_v2;

import com.collge.SEARCHSERVICE.service_v2.UserSearchService_V2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v2/search")
public class UserSearchController_V2 {

    @Autowired
    private UserSearchService_V2 userSearchServiceV2;

    @GetMapping("/getUsers")
    public ResponseEntity<?> getAllUsersWithQuery(@RequestParam String query, @RequestParam int offset, @RequestParam int pageSize, @RequestParam Long userId) throws Exception{
        return userSearchServiceV2.getAllUsersWithQuery(query, offset,pageSize, userId);
    }

}
