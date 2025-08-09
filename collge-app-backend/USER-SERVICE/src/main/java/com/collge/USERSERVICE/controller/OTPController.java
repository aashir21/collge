package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.DTO.PasswordDTO;
import com.collge.USERSERVICE.DTO.UserVerificationDTO;
import com.collge.USERSERVICE.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("api/v1/otp")
@CrossOrigin("*")
public class OTPController {

    @Autowired
    private OTPService otpService;

    public OTPController() {
    }

    @GetMapping("/sendOTP")
    public ResponseEntity<?> sendOTP(@RequestParam String email) throws IOException {
        return this.otpService.generateAndStoreOTP(email);
    }

    @GetMapping("/verifyOTP")
    public ResponseEntity<?> verifyOTP(@RequestParam Long userId, @RequestParam String otpCode) {
        return this.otpService.verifyOTP(userId, otpCode);
    }

    @GetMapping("/user/verifyOTP")
    public ResponseEntity<?> verifyUserVerificationOTP(@RequestParam Long userId,@RequestParam String otp) {
        return this.otpService.verifyUserVerificationOTP(userId, otp);
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody PasswordDTO passwordDTO) {
        return this.otpService.changePassword(passwordDTO);
    }

}
