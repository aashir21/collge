package com.collge.USERSERVICE.service;

import org.springframework.security.web.authentication.logout.LogoutHandler;
import com.collge.USERSERVICE.exception.UserNotFoundException;
import com.collge.USERSERVICE.model.Token;
import com.collge.USERSERVICE.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogoutService implements LogoutHandler {

    @Autowired
    private TokenRepository tokenRepository;


    public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                List<Token> storedTokens = this.tokenRepository.findByToken(token);
                if (!storedTokens.isEmpty()) {
                    storedTokens.forEach(storedToken -> {
                        storedToken.setUser(null);
                        storedToken.setRevoked(true);
                        storedToken.setExpired(true);
                        this.tokenRepository.save(storedToken);
                    });
                }
            }
        } catch (Exception e) {
            throw new UserNotFoundException("Something went wrong: " + e.getMessage());
        }
    }

}
