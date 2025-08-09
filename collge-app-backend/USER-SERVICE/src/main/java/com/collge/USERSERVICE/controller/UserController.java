package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.DTO.SearchDTO;
import com.collge.USERSERVICE.DTO.UpdateBioDTO;
import com.collge.USERSERVICE.DTO.UserAccountVerificationDataDTO;
import com.collge.USERSERVICE.DTO.VerificationRejectionReasons;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import com.collge.USERSERVICE.model.User;
import com.collge.USERSERVICE.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/v1/user")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/getAllUsers")
    @ResponseStatus(HttpStatus.OK)
    public List<User> getAllUsers() {
        return this.userService.getAllUsers();
    }

    @GetMapping("/getUserById/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable long userId) {
        return this.userService.getUserById(userId);
    }

    @GetMapping("/verifyEmail")
    public ResponseEntity<?> verifyEmail(@RequestParam Long userId, @RequestParam String code,
            HttpServletRequest request) {
        if ("GET".equals(request.getMethod())) {
            // Proceed with verification
            return this.userService.verifyEmail(userId, code);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/resendVerifyEmail")
    public ResponseEntity<?> resendVerifyEmail(@RequestParam Long userId) throws IOException {
        return this.userService.resendVerifyEmail(userId);
    }

    @GetMapping("/getUserByEmail")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        return this.userService.getUserByEmail(email);
    }

    @GetMapping("/getUserDetailsByEmail")
    public SearchDTO getUserDetailsByEmail(@RequestParam String email) {
        return this.userService.getUserDetailsByEmail(email);
    }

    @GetMapping("/isUserVerified")
    public ResponseEntity<?> isUserVerified(@RequestParam Long userId) {
        return this.userService.isUserVerified(userId);
    }

    @GetMapping("/findByUsername")
    public ResponseEntity<?> findByUsername(@RequestParam String username) {
        return this.userService.findUserByUsername(username);
    }

    @GetMapping("/getUserDetails")
    public ResponseEntity<?> getUserDetails(@RequestParam Long userId) {
        return this.userService.getUserDetails(userId);
    }

    @GetMapping("/getUserPostDataById")
    public ResponseEntity<?> getUserPostDataById(Long userId) {
        return this.userService.getUserPostDataById(userId);
    }

    @GetMapping("/getUserLinkUpDataByAuthorId")
    public ResponseEntity<?> getUserLinkUpDataById(Long userId) {
        return userService.getUserLinkUpDataById(userId);
    }

    @GetMapping("/updateReputation")
    public ResponseEntity<?> updateReputation(Long userId, int updatedVote) {
        return userService.updateReputation(userId, updatedVote);
    }

    @GetMapping("/getWinkableStatus")
    public ResponseEntity<?> getWinkableStatus(@RequestParam Long userId) {
        return userService.getWinkableStatus(userId);
    }

    @PutMapping("/updateWinkableStatus")
    public ResponseEntity<?> updateWinkableStatus(Long userId, boolean status) {
        return userService.updateWinkableStatus(userId, status);
    }

    @GetMapping("/getLinkUpVerificationStatus")
    public ResponseEntity<?> getLinkUpVerificationStatus(@RequestParam Long userId) {
        return userService.getLinkUpVerificationStatus(userId);
    }

    @PutMapping("/updateUserLinkUp")
    public ResponseEntity<?> updateUserLinkUp(@RequestParam String email, @RequestParam String verificationType) {
        return userService.updateUserLinkUp(email, verificationType);
    }

    @PutMapping("/updateFire")
    public void updateFire(@RequestParam Long userId, @RequestParam Long authorId,
            @RequestParam(required = false) Long collaboratorId) {
        userService.updateUsersFirePoints(userId, authorId, collaboratorId);
    }

    @GetMapping("/getUserCampusByUserId")
    public String getUserCampusByUserId(Long userId) {
        return userService.getUserCampusByUserId(userId);
    }

    @GetMapping("/getUserAccountVerificationData")
    public UserAccountVerificationDataDTO getUserAccountVerificationData(String email) {
        return userService.getUserAccountVerificationData(email);
    }

    @PutMapping("/updateUserBio")
    public ResponseEntity<?> updateUserBio(@RequestBody UpdateBioDTO updateBioDTO) {

        return userService.updateUserBio(updateBioDTO);

    }

    @PostMapping("/sendRejectionEmail")
    void sendRejectionEmail(@RequestBody VerificationRejectionReasons rejectionReasons) {
        userService.sendRejectionEmail(rejectionReasons);
    }

    @DeleteMapping("/deleteAccount/{userId}")
    void deleteAccount(@PathVariable Long userId) {
        userService.deleteAccount(userId);
    }

    @GetMapping("/getAllUsersOfAUniversity")
    ResponseEntity<?> getAllUsersOfAUniversity(@RequestParam Integer universityId, @RequestParam Integer offset, @RequestParam Integer pageSize){

        return userService.getAllUsersOfAUniversity(universityId, offset,pageSize);

    }

}
