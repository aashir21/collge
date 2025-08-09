package com.collge.USERSERVICE.controller;

import com.collge.USERSERVICE.DTO.LogoutDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.*;

import com.collge.USERSERVICE.DTO.JwtResponse;
import com.collge.USERSERVICE.DTO.LoginDTO;
import com.collge.USERSERVICE.DTO.RegisterDTO;
import com.collge.USERSERVICE.service.AuthService;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;


@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginUser(@RequestBody LoginDTO loginDTO) {
        return this.authService.login(loginDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterDTO registerDTO) throws IOException {
        return this.authService.register(registerDTO);
    }

    @PostMapping("/registerByPhotoID")
    public ResponseEntity<?> registerByPhotoID(@RequestBody RegisterDTO registerDTO) throws IOException {
        return this.authService.registerByPhotoID(registerDTO);
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        authService.refreshToken(request, response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutDTO logoutDTO){
        return authService.logout(logoutDTO);
    }

    @PutMapping("/updateLastLogin")
    public ResponseEntity<?> updateLastLogin(@RequestParam Long userId){
        return authService.updateLastLogin(userId);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid !!";
    }


}
