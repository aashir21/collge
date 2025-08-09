package com.collge.NEARBY_SERVICE.controller;

import com.collge.NEARBY_SERVICE.dto.UserLocationDTO;
import com.collge.NEARBY_SERVICE.service.NearbyService;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/nearby")
public class NearbyController {

    @Autowired
    private NearbyService nearbyService;

    @PutMapping
    public ResponseEntity<?> saveUpdateUserLocation(@RequestBody UserLocationDTO userLocationDTO){

        return nearbyService.saveUpdateUserLocation(userLocationDTO);

    }

    @GetMapping
    public ResponseEntity<?> getNearbyUsers(@RequestParam Long userId, @RequestParam Integer offset, @RequestParam Integer pageSize){
        return nearbyService.findUsersWithinRadius(userId,offset,pageSize);
    }

    @GetMapping("/getIsUserDiscoverable")
    public ResponseEntity<?> getIsUserDiscoverable(@RequestParam Long userId){
        return nearbyService.getIsUserDiscoverable(userId);
    }

    @PutMapping("/setIsUserDiscoverable")
    public ResponseEntity<?> setIsUserDiscoverable(@RequestParam Long userId){
        return nearbyService.setIsUserDiscoverable(userId);
    }

}
