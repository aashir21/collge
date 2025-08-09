package com.collge.USERSERVICE.config;

import jakarta.servlet.Filter;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import com.collge.USERSERVICE.security.JWTAuthenticationPoint;
import com.collge.USERSERVICE.security.JWTAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;



@Configuration
public class SecurityConfig {

    @Autowired
    private JWTAuthenticationPoint jwtAuthenticationPoint;
    @Autowired
    private JWTAuthenticationFilter filter;
    @Autowired
    private LogoutHandler logoutHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable).cors(Customizer.withDefaults()).authorizeHttpRequests((auth) -> {
            (auth.requestMatchers("/home/**").authenticated()
                    .requestMatchers("/api/v1/auth/**").permitAll()
                    .requestMatchers("/api/v1/university/**").permitAll()
                    .requestMatchers("/api/v1/user/**").permitAll()
                    .requestMatchers("/api/v1/otp/**").permitAll()
                    .anyRequest()).permitAll();
        }).exceptionHandling((ex) -> {
            ex.authenticationEntryPoint(jwtAuthenticationPoint);
        }).sessionManagement((session) -> {
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        });
        http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
        http.logout(logout -> logout.logoutUrl("api/v1/auth/logout").addLogoutHandler(this.logoutHandler).logoutSuccessHandler((request, response, authentication) -> {
            SecurityContextHolder.clearContext();
        }));
        return http.build();
    }

}
