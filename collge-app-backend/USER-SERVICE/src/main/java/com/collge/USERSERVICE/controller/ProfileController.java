package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.DTO.PasswordDTO;
import com.collge.USERSERVICE.DTO.UpdateBioDTO;
import com.collge.USERSERVICE.DTO.UpdateUsernameDTO;
import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.repository.UserRepository;
import com.collge.USERSERVICE.service.ProfileService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @PutMapping("/updateUsername")
    public ResponseEntity<?> updateUsername(@RequestBody UpdateUsernameDTO updateUsernameDTO){

        return profileService.updateUsername(updateUsernameDTO);

    }

    @PutMapping("/updateBio")
    public ResponseEntity<?> updateBio(@RequestBody UpdateBioDTO updateBioDTO){

        return profileService.updateBio(updateBioDTO);

    }

    @GetMapping("/getBio")
    public ResponseEntity<?> getBio(@RequestParam Long userId){

        return profileService.getBio(userId);

    }

    @PostMapping("/verifyPassword")
    public ResponseEntity<?> verifyPassword(@RequestBody PasswordDTO passwordDTO){
        return profileService.verifyPassword(passwordDTO);
    }

    @PutMapping("/updatePassword")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordDTO passwordDTO){
        return profileService.updatePassword(passwordDTO);
    }

    @PutMapping("/updateAvatar")
    public ResponseEntity<?>updateAvatar(@RequestParam String userData,@RequestParam(required = false) MultipartFile[] files) throws JsonProcessingException {
        return profileService.updateAvatar(userData, files);
    }
}
