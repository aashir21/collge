package com.collge.USERSERVICE.security;

import org.springframework.stereotype.Component;

import java.io.IOException;

import com.collge.USERSERVICE.repository.TokenRepository;
import com.collge.USERSERVICE.security.JWTHelper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;


@Component
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JWTHelper jwtHelper;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private TokenRepository tokenRepository;


    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String username = null;
        String token = null;
        String requestHeader = request.getHeader("Authorization");
        if (requestHeader != null && requestHeader.startsWith("Bearer")) {
            token = requestHeader.substring(7);

            try {
                username = this.jwtHelper.getUsernameFromToken(token);
            } catch (IllegalArgumentException var11) {
                var11.printStackTrace();
            } catch (ExpiredJwtException var12) {
                var12.printStackTrace();
            } catch (MalformedJwtException var13) {
                var13.printStackTrace();
            } catch (Exception var14) {
                var14.printStackTrace();
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            Boolean validateToken = this.jwtHelper.validateToken(token, userDetails);

            Boolean isTokenValid = this.tokenRepository.findByToken(token).stream()
                    .anyMatch(t -> !t.isExpired() && !t.isRevoked());

            if (validateToken && isTokenValid) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(username, null, userDetails.getAuthorities());

                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
