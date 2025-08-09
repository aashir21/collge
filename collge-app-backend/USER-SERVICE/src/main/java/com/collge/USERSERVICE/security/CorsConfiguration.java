package com.collge.USERSERVICE.security;

import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import reactor.util.annotation.NonNullApi;

@Configuration
@NoArgsConstructor
public class CorsConfiguration {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            public void addCorsMappings(CorsRegistry registry) {
                CorsRegistration corsRegistration = registry.addMapping("/**").allowedOrigins(new String[]{"*"}).allowedMethods(new String[]{"GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"}).allowedHeaders(new String[]{"*"});
            }
        };
    }

}
