package com.collge.USERSERVICE.security;

import lombok.NoArgsConstructor;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import org.springframework.security.core.AuthenticationException;


@NoArgsConstructor
@Component
public class JWTAuthenticationPoint implements AuthenticationEntryPoint {

    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(401);
        PrintWriter writer = response.getWriter();
        writer.println("Access Denied! " + authException.getMessage());
    }

}
